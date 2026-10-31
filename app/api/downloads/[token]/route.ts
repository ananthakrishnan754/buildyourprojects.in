import { getDownloadConfig } from "@/lib/config";
import { resolveDeliverableFile } from "@/lib/downloads/files";
import { hashDownloadToken, verifyDownloadToken } from "@/lib/downloads/token";
import { AppError } from "@/lib/errors";
import { clientIp, jsonError } from "@/lib/http";
import { getOrderStore } from "@/lib/payments/store";
import { consumeRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

const MAX_TOKEN_LENGTH = 1024;

export async function GET(request: Request, context: RouteContext) {
  try {
    const limit = consumeRateLimit(`download:${clientIp(request)}`, 30, 60_000);

    if (!limit.allowed) {
      return jsonError(
        new AppError("rate_limited", 429, "Too many download attempts. Try again shortly."),
      );
    }

    const { token } = await context.params;

    if (!token || token.length > MAX_TOKEN_LENGTH) {
      throw new AppError("not_found", 404, "Download link is not valid");
    }

    const config = getDownloadConfig();

    if (!config.configured || !config.secret) {
      throw new AppError(
        "delivery_not_configured",
        503,
        "Downloads are not configured yet",
        { missing: config.missing },
      );
    }

    const verified = verifyDownloadToken(token, config.secret);

    if (!verified.valid) {
      if (verified.reason.includes("expired")) {
        throw new AppError("download_expired", 410, "This download link has expired");
      }
      throw new AppError("not_found", 404, "Download link is not valid");
    }

    const store = getOrderStore();
    const tokenHash = hashDownloadToken(token);
    const download = await store.getDownloadById(verified.payload.d);

    if (
      !download ||
      download.orderId !== verified.payload.o ||
      download.tokenHash !== tokenHash
    ) {
      throw new AppError("not_found", 404, "Download link is not valid");
    }

    if (download.revoked) {
      throw new AppError("not_found", 404, "Download link is not valid");
    }

    // Resolve the file before claiming, so a missing deliverable never consumes
    // one of the customer's attempts.
    const file = await resolveDeliverableFile(download.deliverableKey);

    if (!file) {
      throw new AppError(
        "deliverable_not_published",
        503,
        "The download file is not published yet. Contact support and your attempt was not used.",
      );
    }

    const claimed = await store.claimDownload(tokenHash);

    if (!claimed) {
      const current = await store.getDownloadById(download.id);

      if (!current) {
        throw new AppError("not_found", 404, "Download link is not valid");
      }

      if (current.revoked) {
        throw new AppError("not_found", 404, "Download link is not valid");
      }

      if (new Date(current.expiresAt).getTime() <= Date.now()) {
        throw new AppError("download_expired", 410, "This download link has expired");
      }

      throw new AppError(
        "download_exhausted",
        429,
        "This link has reached its download limit. Contact support for a new link.",
      );
    }

    return new Response(new Uint8Array(file.bytes), {
      status: 200,
      headers: {
        "content-type": file.contentType,
        "content-length": String(file.bytes.byteLength),
        "content-disposition": `attachment; filename="${file.filename}"`,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
