import { AppError } from "@/lib/errors";
import { clientIp, jsonError, noStoreJson } from "@/lib/http";
import { confirmPayment } from "@/lib/payments/confirm";
import { consumeRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 8 * 1024;

function parseBody(raw: string): Record<string, unknown> {
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    throw new AppError("bad_request", 413, "Request body is too large");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AppError("bad_request", 400, "Request body must be JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new AppError("bad_request", 400, "Request body must be a JSON object");
  }

  return parsed as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Razorpay Standard Checkout handshake.
 *
 * Accepts the canonical Razorpay field names (`razorpay_order_id`,
 * `razorpay_payment_id`, `razorpay_signature`) and the short aliases used by
 * server-to-server callers.
 */
export async function POST(request: Request) {
  try {
    const limit = consumeRateLimit(
      `verify-payment:${clientIp(request)}`,
      20,
      60_000,
    );

    if (!limit.allowed) {
      return noStoreJson(
        {
          error: {
            code: "rate_limited",
            message: "Too many verification attempts. Try again shortly.",
          },
        },
        {
          status: 429,
          headers: { "retry-after": String(limit.retryAfterSeconds) },
        },
      );
    }

    const body = parseBody(await request.text());

    const orderId =
      asString(body.razorpay_order_id) ?? asString(body.order_id);
    const paymentId =
      asString(body.razorpay_payment_id) ?? asString(body.payment_id);
    const signature =
      asString(body.razorpay_signature) ?? asString(body.signature);

    const missing = [
      !orderId && "razorpay_order_id",
      !paymentId && "razorpay_payment_id",
      !signature && "razorpay_signature",
    ].filter(Boolean);

    if (missing.length > 0) {
      throw new AppError(
        "bad_request",
        400,
        `Missing required field(s): ${missing.join(", ")}`,
      );
    }

    const result = await confirmPayment({
      orderId: orderId as string,
      paymentId: paymentId as string,
      signature: signature as string,
    });

    return noStoreJson({
      ok: true,
      status: result.status,
      orderNumber: result.orderNumber,
      downloadUrl: result.downloadUrl,
      expiresAt: result.expiresAt,
      emailStatus: result.emailStatus,
    });
  } catch (error) {
    return jsonError(error);
  }
}
