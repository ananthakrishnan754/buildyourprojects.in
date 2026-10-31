import { PaymentConfigError } from "@/lib/errors";
import { clientIp, jsonError, noStoreJson } from "@/lib/http";
import { startCheckout } from "@/lib/payments/checkout";
import { getPaymentProvider } from "@/lib/payments/registry";
import { getOrderStore } from "@/lib/payments/store";
import { consumeRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 8 * 1024;

function parseBody(raw: string): Record<string, unknown> {
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    throw new Error("Request body is too large");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Request body must be JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Request body must be a JSON object");
  }

  return parsed as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function POST(request: Request) {
  try {
    const limit = consumeRateLimit(`checkout:${clientIp(request)}`, 10, 60_000);

    if (!limit.allowed) {
      return noStoreJson(
        { error: { code: "rate_limited", message: "Too many checkout attempts. Try again shortly." } },
        { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } },
      );
    }

    const provider = getPaymentProvider();

    if (!provider) {
      throw new PaymentConfigError(
        "Payments are not configured. Checkout is closed until test keys are set.",
      );
    }

    const body = parseBody(await request.text());
    const productSlug = asString(body.productSlug);
    const email = asString(body.email);

    if (!productSlug || !email) {
      return noStoreJson(
        {
          error: {
            code: "bad_request",
            message: "productSlug and email are required",
          },
        },
        { status: 400 },
      );
    }

    const session = await startCheckout(
      {
        productSlug,
        email,
        name: asString(body.name) ?? null,
        idempotencyKey:
          request.headers.get("idempotency-key") ??
          asString(body.idempotencyKey) ??
          null,
        pricePaise: asNumber(body.pricePaise) ?? null,
      },
      { store: getOrderStore(), provider },
    );

    return noStoreJson(session);
  } catch (error) {
    return jsonError(error);
  }
}
