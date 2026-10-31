import { getDownloadConfig, getSiteUrl, getSupportEmail } from "@/lib/config";
import { selectMailer } from "@/lib/email/registry";
import { AppError } from "@/lib/errors";
import { jsonError, noStoreJson } from "@/lib/http";
import { getPaymentProviderById } from "@/lib/payments/registry";
import { getOrderStore } from "@/lib/payments/store";
import { handleWebhook } from "@/lib/payments/webhook";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 256 * 1024;

type RouteContext = { params: Promise<{ provider: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { provider: providerId } = await context.params;
    const provider = getPaymentProviderById(providerId);

    if (!provider) {
      throw new AppError("not_found", 404, "Unknown or inactive payment provider");
    }

    const rawBody = await request.text();

    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      throw new AppError("bad_request", 413, "Webhook body is too large");
    }

    const outcome = await handleWebhook(
      { rawBody, headers: request.headers },
      {
        store: getOrderStore(),
        provider,
        mailer: selectMailer().mailer,
        downloadConfig: getDownloadConfig(),
        siteUrl: getSiteUrl(),
        supportEmail: getSupportEmail(),
      },
    );

    return noStoreJson({ received: true, ...outcome });
  } catch (error) {
    return jsonError(error);
  }
}
