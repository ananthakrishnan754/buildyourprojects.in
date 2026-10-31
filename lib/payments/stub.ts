import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type {
  CreateOrderInput,
  NormalizedWebhookEvent,
  PaymentProvider,
  ProviderOrder,
  RefundInput,
  RefundResult,
  WebhookVerification,
} from "@/lib/payments/provider";

const DEFAULT_STUB_SECRET = "byp-local-stub-secret";

export type StubOptions = {
  secret?: string;
  nodeEnv?: string;
};

export function resolveStubSecret(secret?: string): string {
  return secret?.trim() || DEFAULT_STUB_SECRET;
}

export function stubSignature(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

/**
 * Local development provider. It never contacts a gateway and never charges.
 * It is refused in production by the registry.
 */
export class StubProvider implements PaymentProvider {
  readonly id = "stub" as const;
  readonly displayName = "Local stub (no charge)";

  private readonly secret: string;
  private readonly nodeEnv: string;

  constructor(options: StubOptions = {}) {
    this.secret = resolveStubSecret(options.secret);
    this.nodeEnv = options.nodeEnv ?? process.env.NODE_ENV ?? "development";
  }

  configurationErrors(): string[] {
    return this.nodeEnv === "production"
      ? ["The stub provider is disabled in production"]
      : [];
  }

  isConfigured(): boolean {
    return this.configurationErrors().length === 0;
  }

  async createOrder(input: CreateOrderInput): Promise<ProviderOrder> {
    return {
      providerOrderId: `stub_order_${randomUUID()}`,
      amountPaise: input.amountPaise,
      currency: input.currency,
    };
  }

  verifyWebhook(rawBody: string, headers: Headers): WebhookVerification {
    const signature = headers.get("x-stub-signature");

    if (!signature || !this.matches(rawBody, signature)) {
      return { valid: false, reason: "Invalid stub webhook signature" };
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return { valid: false, reason: "Webhook body is not valid JSON" };
    }

    if (!parsed || typeof parsed !== "object") {
      return { valid: false, reason: "Webhook body is not a JSON object" };
    }

    const body = parsed as {
      id?: string;
      event?: string;
      order_id?: string;
      payment_id?: string;
      amount?: number;
      currency?: string;
      method?: string;
    };

    const eventType = body.event ?? "unknown";
    const eventId =
      headers.get("x-stub-event-id")?.trim() ||
      body.id ||
      createHash("sha256").update(rawBody, "utf8").digest("hex");

    const kind: NormalizedWebhookEvent["kind"] =
      eventType === "payment.captured"
        ? "payment_captured"
        : eventType === "payment.failed"
          ? "payment_failed"
          : "ignored";

    return {
      valid: true,
      event: {
        eventId,
        eventType,
        kind,
        providerOrderId: body.order_id,
        providerPaymentId: body.payment_id,
        amountPaise: body.amount,
        currency: body.currency,
        method: body.method,
        payload: parsed,
      },
    };
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    return {
      refundId: `stub_refund_${randomUUID()}`,
      status: "processed",
      amountPaise: input.amountPaise ?? 0,
    };
  }

  private matches(rawBody: string, signature: string): boolean {
    const expected = stubSignature(rawBody, this.secret);
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
}
