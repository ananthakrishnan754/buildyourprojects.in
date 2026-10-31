import type { SupabaseClient } from "@supabase/supabase-js";
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
  OrderStatus,
  OrderStore,
  ProductRecord,
  WebhookEventRecord,
  WebhookEventStatus,
} from "@/lib/payments/store";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price_paise: number;
  currency: "INR";
  deliverable_key: string;
  active: boolean;
};

type OrderRow = {
  id: string;
  order_number: string;
  idempotency_key: string;
  product_id: string;
  product_slug: string;
  customer_email: string;
  customer_name: string | null;
  amount_paise: number;
  currency: "INR";
  status: OrderStatus;
  provider: string;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  created_at: string;
};

type WebhookRow = {
  id: string;
  provider: string;
  event_id: string;
  event_type: string;
  status: WebhookEventStatus;
  attempts: number;
};

type DownloadRow = {
  id: string;
  order_id: string;
  product_id: string;
  product_slug: string;
  deliverable_key: string;
  token_hash: string;
  expires_at: string;
  max_downloads: number;
  download_count: number;
  revoked: boolean;
};

const DUPLICATE = "23505";

function isDuplicate(error: { code?: string } | null): boolean {
  return error?.code === DUPLICATE;
}

function toProduct(row: ProductRow): ProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    pricePaise: row.price_paise,
    currency: row.currency,
    deliverableKey: row.deliverable_key,
    active: row.active,
  };
}

function toOrder(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    idempotencyKey: row.idempotency_key,
    productId: row.product_id,
    productSlug: row.product_slug,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    amountPaise: row.amount_paise,
    currency: row.currency,
    status: row.status,
    provider: row.provider,
    providerOrderId: row.provider_order_id,
    providerPaymentId: row.provider_payment_id,
    createdAt: row.created_at,
  };
}

function toWebhook(row: WebhookRow): WebhookEventRecord {
  return {
    id: row.id,
    provider: row.provider,
    eventId: row.event_id,
    eventType: row.event_type,
    status: row.status,
    attempts: row.attempts,
  };
}

function toDownload(row: DownloadRow): DownloadRecord {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productSlug: row.product_slug,
    deliverableKey: row.deliverable_key,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    maxDownloads: row.max_downloads,
    downloadCount: row.download_count,
    revoked: row.revoked,
  };
}

export class SupabaseOrderStore implements OrderStore {
  constructor(private readonly client: SupabaseClient) {}

  async getProductBySlug(slug: string): Promise<ProductRecord | null> {
    const { data, error } = await this.client
      .from("products")
      .select(
        "id, slug, name, price_paise, currency, deliverable_key, active",
      )
      .eq("slug", slug)
      .maybeSingle<ProductRow>();

    if (error) throw new Error(`Failed to read product: ${error.message}`);
    return data ? toProduct(data) : null;
  }

  async getOrderByIdempotencyKey(key: string): Promise<OrderRecord | null> {
    const { data, error } = await this.client
      .from("orders")
      .select("*")
      .eq("idempotency_key", key)
      .maybeSingle<OrderRow>();

    if (error) throw new Error(`Failed to read order: ${error.message}`);
    return data ? toOrder(data) : null;
  }

  async createOrder(input: NewOrder): Promise<OrderRecord> {
    const { data, error } = await this.client
      .from("orders")
      .insert({
        order_number: input.orderNumber,
        idempotency_key: input.idempotencyKey,
        product_id: input.productId,
        product_slug: input.productSlug,
        customer_email: input.customerEmail,
        customer_name: input.customerName,
        amount_paise: input.amountPaise,
        currency: input.currency,
        provider: input.provider,
        status: "pending",
      })
      .select("*")
      .single<OrderRow>();

    if (error) throw new Error(`Failed to create order: ${error.message}`);

    const order = toOrder(data);

    const { error: itemError } = await this.client.from("order_items").insert({
      order_id: order.id,
      product_id: order.productId,
      product_slug: order.productSlug,
      name: input.productName,
      quantity: 1,
      unit_amount_paise: order.amountPaise,
      total_paise: order.amountPaise,
    });

    if (itemError) {
      console.error("[payments] order item insert failed", itemError.message);
    }

    return order;
  }

  async attachProviderOrder(
    orderId: string,
    providerOrderId: string,
  ): Promise<void> {
    const { error } = await this.client
      .from("orders")
      .update({ provider_order_id: providerOrderId })
      .eq("id", orderId);

    if (error) {
      throw new Error(`Failed to attach gateway order: ${error.message}`);
    }
  }

  async getOrderByProviderOrderId(
    provider: string,
    providerOrderId: string,
  ): Promise<OrderRecord | null> {
    const { data, error } = await this.client
      .from("orders")
      .select("*")
      .eq("provider", provider)
      .eq("provider_order_id", providerOrderId)
      .maybeSingle<OrderRow>();

    if (error) throw new Error(`Failed to read order: ${error.message}`);
    return data ? toOrder(data) : null;
  }

  async claimWebhookEvent(
    input: ClaimWebhookInput,
  ): Promise<{ claimed: boolean; event: WebhookEventRecord }> {
    const { data, error } = await this.client
      .from("webhook_events")
      .insert({
        provider: input.provider,
        event_id: input.eventId,
        event_type: input.eventType,
        signature_valid: input.signatureValid,
        payload: input.payload,
        status: "received",
      })
      .select("id, provider, event_id, event_type, status, attempts")
      .single<WebhookRow>();

    if (!error && data) {
      return { claimed: true, event: toWebhook(data) };
    }

    if (!isDuplicate(error)) {
      throw new Error(
        `Failed to claim webhook event: ${error?.message ?? "unknown error"}`,
      );
    }

    const { data: existing, error: readError } = await this.client
      .from("webhook_events")
      .select("id, provider, event_id, event_type, status, attempts")
      .eq("provider", input.provider)
      .eq("event_id", input.eventId)
      .maybeSingle<WebhookRow>();

    if (readError || !existing) {
      throw new Error(
        `Failed to read webhook event: ${readError?.message ?? "not found"}`,
      );
    }

    if (existing.status !== "received" && existing.status !== "failed") {
      return { claimed: false, event: toWebhook(existing) };
    }

    const { data: retried, error: retryError } = await this.client
      .from("webhook_events")
      .update({
        status: "received",
        error: null,
        attempts: existing.attempts + 1,
      })
      .eq("id", existing.id)
      .select("id, provider, event_id, event_type, status, attempts")
      .single<WebhookRow>();

    if (retryError || !retried) {
      throw new Error(
        `Failed to retry webhook event: ${retryError?.message ?? "unknown error"}`,
      );
    }

    return { claimed: true, event: toWebhook(retried) };
  }

  async finishWebhookEvent(
    id: string,
    status: WebhookEventStatus,
    error?: string | null,
  ): Promise<void> {
    const { error: updateError } = await this.client
      .from("webhook_events")
      .update({
        status,
        error: error ?? null,
        processed_at:
          status === "processed" || status === "ignored"
            ? new Date().toISOString()
            : null,
      })
      .eq("id", id);

    if (updateError) {
      console.error("[payments] webhook update failed", updateError.message);
    }
  }

  async recordPayment(input: NewPayment): Promise<void> {
    const { data: existing, error: readError } = await this.client
      .from("payments")
      .select("id")
      .eq("provider", input.provider)
      .eq("provider_payment_id", input.providerPaymentId)
      .maybeSingle<{ id: string }>();

    if (readError) {
      throw new Error(`Failed to read payment: ${readError.message}`);
    }

    if (existing) {
      const { error } = await this.client
        .from("payments")
        .update({
          status: input.status,
          method: input.method,
          raw_event_id: input.rawEventId,
          amount_paise: input.amountPaise,
        })
        .eq("id", existing.id);

      if (error) throw new Error(`Failed to update payment: ${error.message}`);
      return;
    }

    const { error } = await this.client.from("payments").insert({
      order_id: input.orderId,
      provider: input.provider,
      provider_order_id: input.providerOrderId,
      provider_payment_id: input.providerPaymentId,
      amount_paise: input.amountPaise,
      currency: input.currency,
      status: input.status,
      method: input.method,
      raw_event_id: input.rawEventId,
    });

    if (error && !isDuplicate(error)) {
      throw new Error(`Failed to record payment: ${error.message}`);
    }
  }

  async markOrderPaid(
    orderId: string,
    payment: { providerPaymentId: string },
  ): Promise<boolean> {
    const { data, error } = await this.client
      .from("orders")
      .update({
        status: "paid",
        provider_payment_id: payment.providerPaymentId,
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("status", "pending")
      .select("id");

    if (error) throw new Error(`Failed to mark order paid: ${error.message}`);
    return Array.isArray(data) && data.length > 0;
  }

  async markOrderFailed(orderId: string, reason?: string | null): Promise<void> {
    const { error } = await this.client
      .from("orders")
      .update({ status: "failed" })
      .eq("id", orderId)
      .eq("status", "pending");

    if (error) {
      console.error(
        `[payments] failed to mark order failed${reason ? ` (${reason})` : ""}`,
        error.message,
      );
    }
  }

  async getDownloadByOrderId(orderId: string): Promise<DownloadRecord | null> {
    const { data, error } = await this.client
      .from("downloads")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle<DownloadRow>();

    if (error) throw new Error(`Failed to read download: ${error.message}`);
    return data ? toDownload(data) : null;
  }

  async getDownloadById(downloadId: string): Promise<DownloadRecord | null> {
    const { data, error } = await this.client
      .from("downloads")
      .select("*")
      .eq("id", downloadId)
      .maybeSingle<DownloadRow>();

    if (error) throw new Error(`Failed to read download: ${error.message}`);
    return data ? toDownload(data) : null;
  }

  async createDownload(input: NewDownload): Promise<DownloadRecord> {
    const { data, error } = await this.client
      .from("downloads")
      .insert({
        // The signing token is built around this id, so the row must keep it.
        // Letting Postgres generate a fresh uuid here breaks every download link.
        id: input.id,
        order_id: input.orderId,
        product_id: input.productId,
        product_slug: input.productSlug,
        deliverable_key: input.deliverableKey,
        token_hash: input.tokenHash,
        expires_at: input.expiresAt,
        max_downloads: input.maxDownloads,
      })
      .select("*")
      .single<DownloadRow>();

    if (!error && data) return toDownload(data);

    if (!isDuplicate(error)) {
      throw new Error(
        `Failed to create download: ${error?.message ?? "unknown error"}`,
      );
    }

    const existing = await this.getDownloadByOrderId(input.orderId);

    if (!existing) {
      throw new Error("Download insert conflicted but no row was found");
    }

    return existing;
  }

  async rotateDownloadToken(
    downloadId: string,
    tokenHash: string,
    expiresAt: string,
  ): Promise<DownloadRecord> {
    const { data, error } = await this.client
      .from("downloads")
      .update({ token_hash: tokenHash, expires_at: expiresAt })
      .eq("id", downloadId)
      .select("*")
      .single<DownloadRow>();

    if (error || !data) {
      throw new Error(
        `Failed to rotate download token: ${error?.message ?? "not found"}`,
      );
    }

    return toDownload(data);
  }

  async claimDownload(tokenHash: string): Promise<DownloadRecord | null> {
    const { data, error } = await this.client.rpc("claim_download", {
      p_token_hash: tokenHash,
    });

    if (error) throw new Error(`Failed to claim download: ${error.message}`);

    const rows = data as DownloadRow[] | null;
    return rows && rows.length > 0 ? toDownload(rows[0]!) : null;
  }

  async logEmail(input: NewEmailLog): Promise<EmailLogRecord> {
    const { data, error } = await this.client
      .from("email_log")
      .insert({
        order_id: input.orderId,
        to_email: input.toEmail,
        template: input.template,
        subject: input.subject,
        status: input.status,
        provider: input.provider,
        error: input.error,
        payload: input.payload,
      })
      .select("id, status")
      .single<{ id: string; status: EmailLogRecord["status"] }>();

    if (error) throw new Error(`Failed to log email: ${error.message}`);
    return { id: data.id, status: data.status };
  }

  async updateEmailLog(id: string, patch: EmailLogPatch): Promise<void> {
    const { error } = await this.client
      .from("email_log")
      .update({
        status: patch.status,
        ...(patch.provider !== undefined ? { provider: patch.provider } : {}),
        ...(patch.messageId !== undefined ? { message_id: patch.messageId } : {}),
        ...(patch.error !== undefined ? { error: patch.error } : {}),
        ...(patch.sentAt !== undefined ? { sent_at: patch.sentAt } : {}),
      })
      .eq("id", id);

    if (error) {
      console.error("[payments] email log update failed", error.message);
    }
  }
}
