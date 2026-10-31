import { randomUUID } from "node:crypto";
import { getDownloadConfig, getSiteUrl, getSupportEmail } from "@/lib/config";
import { selectMailer } from "@/lib/email/registry";
import { AppError } from "@/lib/errors";
import { jsonError, noStoreJson } from "@/lib/http";
import { getPaymentProviderById } from "@/lib/payments/registry";
import { getOrderStore } from "@/lib/payments/store";
import {
  resolveStubSecret,
  stubSignature,
} from "@/lib/payments/stub";
import { handleWebhook } from "@/lib/payments/webhook";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Local-only synthetic payment. It is unavailable in production and whenever
 * the configured provider is not the stub, because `getPaymentProviderById`
 * returns null in both cases. It exists so the full checkout → webhook →
 * download flow can be exercised without Razorpay keys.
 */
export async function POST(request: Request) {
  try {
    const provider = getPaymentProviderById("stub");

    if (!provider) {
      throw new AppError("not_found", 404, "Not available");
    }

    const body = (await request.json().catch(() => ({}))) as {
      orderNumber?: string;
      providerOrderId?: string;
      amountPaise?: number;
    };

    if (!body.providerOrderId || !body.amountPaise) {
      throw new AppError(
        "bad_request",
        400,
        "providerOrderId and amountPaise are required",
      );
    }

    const eventId = `stub_evt_${randomUUID()}`;
    const rawBody = JSON.stringify({
      id: eventId,
      event: "payment.captured",
      order_id: body.providerOrderId,
      payment_id: `stub_pay_${randomUUID()}`,
      amount: body.amountPaise,
      currency: "INR",
      method: "stub",
    });

    const headers = new Headers({
      "x-stub-event-id": eventId,
      "x-stub-signature": stubSignature(
        rawBody,
        resolveStubSecret(process.env.PAYMENTS_STUB_SECRET),
      ),
    });

    const outcome = await handleWebhook(
      { rawBody, headers },
      {
        store: getOrderStore(),
        provider,
        mailer: selectMailer().mailer,
        downloadConfig: getDownloadConfig(),
        siteUrl: getSiteUrl(),
        supportEmail: getSupportEmail(),
      },
    );

    return noStoreJson(outcome);
  } catch (error) {
    return jsonError(error);
  }
}
