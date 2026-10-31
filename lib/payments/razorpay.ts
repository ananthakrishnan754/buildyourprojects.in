import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { AppError, PaymentConfigError } from "@/lib/errors";
import type {
  CreateOrderInput,
  NormalizedWebhookEvent,
  PaymentProvider,
  ProviderOrder,
  RefundInput,
  RefundResult,
  WebhookVerification,
} from "@/lib/payments/provider";

const RAZORPAY_API = "https://api.razorpay.com/v1";
const LIVE_KEY_PREFIX = "rzp_live_";
const TEST_KEY_PREFIX = "rzp_test_";

export type RazorpayOptions = {
  keyId?: string;
  keySecret?: string;
  webhookSecret?: string;
  fetchImpl?: typeof fetch;
};

type RazorpayErrorBody = {
  error?: { description?: string; code?: string };
};

export function verifyRazorpaySignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string,
): boolean {
  if (!signature || !secret) return false;

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const provided = signature.trim().toLowerCase();

  if (expected.length !== provided.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(provided, "utf8"),
    );
  } catch {
    return false;
  }
}

/**
 * Standard Checkout handshake: the browser returns
 * `razorpay_order_id | razorpay_payment_id | razorpay_signature` and the
 * signature must equal HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET).
 * This is a different secret/algorithm from the webhook signature.
 */
export function verifyRazorpayPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string | null | undefined;
  keySecret: string;
}): boolean {
  const { orderId, paymentId, signature, keySecret } = input;

  if (!orderId || !paymentId || !signature || !keySecret) return false;

  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`, "utf8")
    .digest("hex");
  const provided = signature.trim().toLowerCase();

  if (expected.length !== provided.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(provided, "utf8"),
    );
  } catch {
    return false;
  }
}

function safeJson(rawBody: string): unknown {
  try {
    return JSON.parse(rawBody);
  } catch {
    return null;
  }
}

export class RazorpayProvider implements PaymentProvider {
  readonly id = "razorpay" as const;
  readonly displayName = "Razorpay (test mode)";

  private readonly keyId?: string;
  private readonly keySecret?: string;
  private readonly webhookSecret?: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: RazorpayOptions = {}) {
    this.keyId = options.keyId?.trim() || undefined;
    this.keySecret = options.keySecret?.trim() || undefined;
    this.webhookSecret = options.webhookSecret?.trim() || undefined;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  configurationErrors(): string[] {
    const errors: string[] = [];

    if (!this.keyId) errors.push("RAZORPAY_KEY_ID is missing");
    if (!this.keySecret) errors.push("RAZORPAY_KEY_SECRET is missing");
    // A missing webhook secret only disables webhook verification; the browser
    // handshake at /api/verify-payment still confirms a captured payment.

    if (this.keyId?.startsWith(LIVE_KEY_PREFIX)) {
      errors.push("RAZORPAY_KEY_ID is a live key; test mode only");
    } else if (this.keyId && !this.keyId.startsWith(TEST_KEY_PREFIX)) {
      errors.push("RAZORPAY_KEY_ID does not look like a test key");
    }

    return errors;
  }

  isConfigured(): boolean {
    return this.configurationErrors().length === 0;
  }

  private authHeader(): string {
    if (!this.keyId || !this.keySecret) {
      throw new PaymentConfigError("Razorpay credentials are not configured");
    }

    return `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`, "utf8").toString("base64")}`;
  }

  async createOrder(input: CreateOrderInput): Promise<ProviderOrder> {
    if (!this.isConfigured()) {
      throw new PaymentConfigError(
        `Razorpay is not usable: ${this.configurationErrors().join("; ")}`,
      );
    }

    if (!Number.isInteger(input.amountPaise) || input.amountPaise <= 0) {
      throw new AppError("bad_request", 400, "amountPaise must be a positive integer");
    }

    const response = await this.fetchImpl(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: {
        authorization: this.authHeader(),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountPaise,
        currency: input.currency,
        receipt: input.receipt,
        notes: input.notes ?? {},
        payment_capture: 1,
      }),
      cache: "no-store",
    });

    const body = (await response.json().catch(() => ({}))) as
      | { id?: string; amount?: number; currency?: string }
      | RazorpayErrorBody;

    if (!response.ok || !("id" in body) || !body.id) {
      const detail =
        "error" in body ? body.error?.description : undefined;
      throw new AppError(
        "gateway_error",
        502,
        `Razorpay order creation failed${detail ? `: ${detail}` : ""}`,
        { status: response.status },
      );
    }

    return {
      providerOrderId: body.id,
      amountPaise: body.amount ?? input.amountPaise,
      currency: "INR",
      keyId: this.keyId,
    };
  }

  verifyWebhook(rawBody: string, headers: Headers): WebhookVerification {
    if (!this.webhookSecret) {
      return { valid: false, reason: "RAZORPAY_WEBHOOK_SECRET is not configured" };
    }

    const signature = headers.get("x-razorpay-signature");

    if (!verifyRazorpaySignature(rawBody, signature, this.webhookSecret)) {
      return { valid: false, reason: "Invalid Razorpay webhook signature" };
    }

    const parsed = safeJson(rawBody);

    if (!parsed || typeof parsed !== "object") {
      return { valid: false, reason: "Webhook body is not valid JSON" };
    }

    const body = parsed as {
      event?: string;
      id?: string;
      payload?: {
        payment?: { entity?: Record<string, unknown> };
        order?: { entity?: Record<string, unknown> };
      };
    };

    const eventType = body.event ?? "unknown";
    const headerEventId = headers.get("x-razorpay-event-id");
    const eventId = headerEventId?.trim() || body.id || hashPayload(rawBody);

    const payment = body.payload?.payment?.entity as
      | {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          method?: string;
        }
      | undefined;
    const order = body.payload?.order?.entity as
      | { id?: string; amount?: number; amount_paid?: number; currency?: string }
      | undefined;

    let kind: NormalizedWebhookEvent["kind"] = "ignored";

    if (eventType === "payment.captured" || eventType === "order.paid") {
      kind = "payment_captured";
    } else if (
      eventType === "payment.failed" ||
      eventType === "order.payment_failed"
    ) {
      kind = "payment_failed";
    }

    return {
      valid: true,
      event: {
        eventId,
        eventType,
        kind,
        providerOrderId: payment?.order_id ?? order?.id,
        providerPaymentId: payment?.id,
        amountPaise:
          payment?.amount ?? order?.amount_paid ?? order?.amount ?? undefined,
        currency: payment?.currency ?? order?.currency,
        method: payment?.method,
        payload: parsed,
      },
    };
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    if (!this.isConfigured()) {
      throw new PaymentConfigError(
        `Razorpay is not usable: ${this.configurationErrors().join("; ")}`,
      );
    }

    if (!input.providerPaymentId) {
      throw new AppError("bad_request", 400, "providerPaymentId is required");
    }

    const response = await this.fetchImpl(
      `${RAZORPAY_API}/payments/${encodeURIComponent(input.providerPaymentId)}/refund`,
      {
        method: "POST",
        headers: {
          authorization: this.authHeader(),
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...(input.amountPaise ? { amount: input.amountPaise } : {}),
          notes: input.notes ?? {},
          speed: "normal",
        }),
        cache: "no-store",
      },
    );

    const body = (await response.json().catch(() => ({}))) as
      | { id?: string; status?: string; amount?: number }
      | RazorpayErrorBody;

    if (!response.ok || !("id" in body) || !body.id) {
      const detail = "error" in body ? body.error?.description : undefined;
      throw new AppError(
        "gateway_error",
        502,
        `Razorpay refund failed${detail ? `: ${detail}` : ""}`,
        { status: response.status },
      );
    }

    return {
      refundId: body.id,
      status: body.status ?? "unknown",
      amountPaise: body.amount ?? input.amountPaise ?? 0,
    };
  }
}

export function hashPayload(rawBody: string): string {
  return createHash("sha256").update(rawBody, "utf8").digest("hex");
}
