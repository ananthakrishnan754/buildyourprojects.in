import { getDownloadConfig, getSiteUrl, getSupportEmail } from "@/lib/config";
import { AppError } from "@/lib/errors";
import { randomUUID } from "node:crypto";
import { hashDownloadToken, signDownloadToken } from "@/lib/downloads/token";
import type { Mailer } from "@/lib/email/mailer";
import { receiptEmail } from "@/lib/email/templates";
import type {
  EmailStatus,
  OrderRecord,
  OrderStore,
  ProductRecord,
} from "@/lib/payments/store";

export type FulfilmentDeps = {
  store: OrderStore;
  mailer: Mailer | null;
  downloadConfig: ReturnType<typeof getDownloadConfig>;
  siteUrl: string;
  supportEmail: string;
  now?: () => Date;
};

export type FulfilmentResult = {
  downloadId: string;
  expiresAt: string;
  emailStatus: EmailStatus;
  /** Signed, expiring download link. Present only when delivery is configured. */
  downloadUrl?: string;
};

/**
 * Creates (or rotates) the download row and sends the receipt. It never
 * invents a download URL when `DOWNLOAD_TOKEN_SECRET` is missing.
 */
export async function fulfilPaidOrder(
  input: { order: OrderRecord; product: ProductRecord },
  deps: FulfilmentDeps,
): Promise<FulfilmentResult> {
  const { order, product } = input;
  const now = deps.now ? deps.now() : new Date();

  if (!deps.downloadConfig.configured || !deps.downloadConfig.secret) {
    throw new AppError(
      "delivery_not_configured",
      503,
      "DOWNLOAD_TOKEN_SECRET is not configured; no download link was issued",
      { missing: deps.downloadConfig.missing },
    );
  }

  const expiresAt = new Date(
    now.getTime() + deps.downloadConfig.ttlHours * 60 * 60 * 1000,
  );

  const existing = await deps.store.getDownloadByOrderId(order.id);
  const downloadId = existing?.id ?? randomUUID();

  const token = signDownloadToken({
    downloadId,
    orderId: order.id,
    expiresAt,
    secret: deps.downloadConfig.secret,
  });
  const tokenHash = hashDownloadToken(token);

  const download = existing
    ? await deps.store.rotateDownloadToken(
        existing.id,
        tokenHash,
        expiresAt.toISOString(),
      )
    : await deps.store.createDownload({
        id: downloadId,
        orderId: order.id,
        productId: product.id,
        productSlug: product.slug,
        deliverableKey: product.deliverableKey,
        tokenHash,
        expiresAt: expiresAt.toISOString(),
        maxDownloads: deps.downloadConfig.maxAttempts,
      });

  const downloadUrl = `${deps.siteUrl.replace(/\/$/, "")}/api/downloads/${encodeURIComponent(token)}`;
  const content = receiptEmail({
    productName: product.name,
    orderNumber: order.orderNumber,
    amountPaise: order.amountPaise,
    downloadUrl,
    expiresAt,
    supportEmail: deps.supportEmail,
  });

  const log = await deps.store.logEmail({
    orderId: order.id,
    toEmail: order.customerEmail,
    template: "receipt",
    subject: content.subject,
    status: "queued",
    provider: deps.mailer?.id ?? null,
    error: deps.mailer ? null : "mailer_not_configured",
    payload: {
      orderNumber: order.orderNumber,
      productSlug: product.slug,
      expiresAt: expiresAt.toISOString(),
    },
  });

  if (!deps.mailer) {
    return {
      downloadId: download.id,
      expiresAt: expiresAt.toISOString(),
      emailStatus: "queued",
      downloadUrl,
    };
  }

  try {
    const result = await deps.mailer.send({
      to: order.customerEmail,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });

    await deps.store.updateEmailLog(log.id, {
      status: "sent",
      provider: deps.mailer.id,
      messageId: result.messageId ?? null,
      error: null,
      sentAt: new Date().toISOString(),
    });

    return {
      downloadId: download.id,
      expiresAt: expiresAt.toISOString(),
      emailStatus: "sent",
      downloadUrl,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown mailer error";

    console.error("[payments] receipt email failed", message);

    await deps.store.updateEmailLog(log.id, {
      status: "failed",
      provider: deps.mailer.id,
      error: message,
    });

    return {
      downloadId: download.id,
      expiresAt: expiresAt.toISOString(),
      emailStatus: "failed",
      downloadUrl,
    };
  }
}

export function defaultFulfilmentDeps(store: OrderStore, mailer: Mailer | null): FulfilmentDeps {
  return {
    store,
    mailer,
    downloadConfig: getDownloadConfig(),
    siteUrl: getSiteUrl(),
    supportEmail: getSupportEmail(),
  };
}
