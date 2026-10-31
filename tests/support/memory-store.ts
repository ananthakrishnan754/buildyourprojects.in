import { randomUUID } from "node:crypto";
import type {
  ClaimWebhookInput,
  DownloadRecord,
  EmailLogPatch,
  EmailLogRecord,
  NewDownload,
  NewEmailLog,
  NewOrder,
  NewPayment,
  OrderRecord,
  OrderStore,
  ProductRecord,
  WebhookEventRecord,
  WebhookEventStatus,
} from "@/lib/payments/store";

type WebhookRow = WebhookEventRecord & {
  error: string | null;
};

type EmailRow = NewEmailLog & {
  id: string;
  messageId: string | null;
  sentAt: string | null;
};

function product(
  id: string,
  slug: string,
  name: string,
  pricePaise: number,
): ProductRecord {
  return {
    id,
    slug,
    name,
    pricePaise,
    currency: "INR",
    deliverableKey: slug,
    active: true,
  };
}

/**
 * In-memory `OrderStore` for unit tests. It mirrors the Supabase store's
 * observable rules: unique idempotency key, one download row per order,
 * only-pending order transitions and an atomic download claim.
 */
export class MemoryStore implements OrderStore {
  readonly products = new Map<string, ProductRecord>();
  readonly orders = new Map<string, OrderRecord>();
  readonly payments: NewPayment[] = [];
  readonly webhookEvents: WebhookRow[] = [];
  readonly downloads: DownloadRecord[] = [];
  readonly emails: EmailRow[] = [];

  constructor() {
    for (const row of [
      product(
        "11111111-1111-4111-8111-111111111111",
        "submission-kit",
        "Submission Kit",
        49900,
      ),
      product(
        "22222222-2222-4222-8222-222222222222",
        "reportforge",
        "ReportForge",
        29900,
      ),
      product(
        "33333333-3333-4333-8333-333333333333",
        "viva-vault",
        "Viva Vault",
        14900,
      ),
    ]) {
      this.products.set(row.slug, row);
    }
  }

  async getProductBySlug(slug: string): Promise<ProductRecord | null> {
    return this.products.get(slug) ?? null;
  }

  async getOrderByIdempotencyKey(key: string): Promise<OrderRecord | null> {
    return (
      [...this.orders.values()].find(
        (order) => order.idempotencyKey === key,
      ) ?? null
    );
  }

  async createOrder(input: NewOrder): Promise<OrderRecord> {
    if (await this.getOrderByIdempotencyKey(input.idempotencyKey)) {
      const error = new Error("duplicate key value violates unique constraint");
      (error as { code?: string }).code = "23505";
      throw error;
    }

    const order: OrderRecord = {
      id: randomUUID(),
      orderNumber: input.orderNumber,
      idempotencyKey: input.idempotencyKey,
      productId: input.productId,
      productSlug: input.productSlug,
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      amountPaise: input.amountPaise,
      currency: input.currency,
      status: "pending",
      provider: input.provider,
      providerOrderId: null,
      providerPaymentId: null,
      createdAt: new Date().toISOString(),
    };

    this.orders.set(order.id, order);
    return order;
  }

  async attachProviderOrder(
    orderId: string,
    providerOrderId: string,
  ): Promise<void> {
    const order = this.orders.get(orderId);
    if (order) order.providerOrderId = providerOrderId;
  }

  async getOrderByProviderOrderId(
    provider: string,
    providerOrderId: string,
  ): Promise<OrderRecord | null> {
    return (
      [...this.orders.values()].find(
        (order) =>
          order.provider === provider &&
          order.providerOrderId === providerOrderId,
      ) ?? null
    );
  }

  async claimWebhookEvent(
    input: ClaimWebhookInput,
  ): Promise<{ claimed: boolean; event: WebhookEventRecord }> {
    const existing = this.webhookEvents.find(
      (row) =>
        row.provider === input.provider && row.eventId === input.eventId,
    );

    if (existing) {
      if (existing.status !== "received" && existing.status !== "failed") {
        return { claimed: false, event: existing };
      }

      existing.status = "received";
      existing.attempts += 1;
      existing.error = null;
      return { claimed: true, event: existing };
    }

    const row: WebhookRow = {
      id: randomUUID(),
      provider: input.provider,
      eventId: input.eventId,
      eventType: input.eventType,
      status: "received",
      attempts: 1,
      error: null,
    };

    this.webhookEvents.push(row);
    return { claimed: true, event: row };
  }

  async finishWebhookEvent(
    id: string,
    status: WebhookEventStatus,
    error?: string | null,
  ): Promise<void> {
    const row = this.webhookEvents.find((item) => item.id === id);
    if (!row) return;
    row.status = status;
    row.error = error ?? null;
  }

  async recordPayment(input: NewPayment): Promise<void> {
    const existing = this.payments.find(
      (payment) =>
        payment.provider === input.provider &&
        payment.providerPaymentId === input.providerPaymentId,
    );

    if (existing) {
      Object.assign(existing, input);
      return;
    }

    this.payments.push({ ...input });
  }

  async markOrderPaid(
    orderId: string,
    payment: { providerPaymentId: string },
  ): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order || order.status !== "pending") return false;

    order.status = "paid";
    order.providerPaymentId = payment.providerPaymentId;
    return true;
  }

  async markOrderFailed(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (order?.status === "pending") order.status = "failed";
  }

  async getDownloadByOrderId(
    orderId: string,
  ): Promise<DownloadRecord | null> {
    return this.downloads.find((row) => row.orderId === orderId) ?? null;
  }

  async getDownloadById(downloadId: string): Promise<DownloadRecord | null> {
    return this.downloads.find((row) => row.id === downloadId) ?? null;
  }

  async createDownload(input: NewDownload): Promise<DownloadRecord> {
    if (await this.getDownloadByOrderId(input.orderId)) {
      const error = new Error("duplicate key value violates unique constraint");
      (error as { code?: string }).code = "23505";
      throw error;
    }

    const row: DownloadRecord = {
      id: input.id,
      orderId: input.orderId,
      productId: input.productId,
      productSlug: input.productSlug,
      deliverableKey: input.deliverableKey,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      maxDownloads: input.maxDownloads,
      downloadCount: 0,
      revoked: false,
    };

    this.downloads.push(row);
    return row;
  }

  async rotateDownloadToken(
    downloadId: string,
    tokenHash: string,
    expiresAt: string,
  ): Promise<DownloadRecord> {
    const row = this.downloads.find((item) => item.id === downloadId);
    if (!row) throw new Error("download not found");

    row.tokenHash = tokenHash;
    row.expiresAt = expiresAt;
    return row;
  }

  async claimDownload(tokenHash: string): Promise<DownloadRecord | null> {
    const row = this.downloads.find((item) => item.tokenHash === tokenHash);
    if (!row) return null;
    if (row.revoked) return null;
    if (new Date(row.expiresAt).getTime() <= Date.now()) return null;
    if (row.downloadCount >= row.maxDownloads) return null;

    row.downloadCount += 1;
    return row;
  }

  async logEmail(input: NewEmailLog): Promise<EmailLogRecord> {
    const row: EmailRow = {
      ...input,
      id: randomUUID(),
      messageId: null,
      sentAt: null,
    };

    this.emails.push(row);
    return { id: row.id, status: row.status };
  }

  async updateEmailLog(id: string, patch: EmailLogPatch): Promise<void> {
    const row = this.emails.find((item) => item.id === id);
    if (!row) return;

    row.status = patch.status;
    if (patch.provider !== undefined) row.provider = patch.provider;
    if (patch.messageId !== undefined) row.messageId = patch.messageId;
    if (patch.error !== undefined) row.error = patch.error;
    if (patch.sentAt !== undefined) row.sentAt = patch.sentAt;
  }
}
