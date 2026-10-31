import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SupabaseOrderStore } from "@/lib/payments/supabase-store";

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type WebhookEventStatus =
  | "received"
  | "processing"
  | "processed"
  | "ignored"
  | "failed";

export type EmailStatus = "queued" | "sent" | "failed" | "skipped";

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  pricePaise: number;
  currency: "INR";
  deliverableKey: string;
  active: boolean;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  idempotencyKey: string;
  productId: string;
  productSlug: string;
  customerEmail: string;
  customerName: string | null;
  amountPaise: number;
  currency: "INR";
  status: OrderStatus;
  provider: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  createdAt: string;
};

export type NewOrder = {
  orderNumber: string;
  idempotencyKey: string;
  productId: string;
  productSlug: string;
  productName: string;
  customerEmail: string;
  customerName: string | null;
  amountPaise: number;
  currency: "INR";
  provider: string;
};

export type WebhookEventRecord = {
  id: string;
  provider: string;
  eventId: string;
  eventType: string;
  status: WebhookEventStatus;
  attempts: number;
};

export type ClaimWebhookInput = {
  provider: string;
  eventId: string;
  eventType: string;
  signatureValid: boolean;
  payload: unknown;
};

export type NewPayment = {
  orderId: string;
  provider: string;
  providerOrderId: string;
  providerPaymentId: string;
  amountPaise: number;
  currency: "INR";
  status: "captured" | "failed";
  method: string | null;
  rawEventId: string;
};

export type NewDownload = {
  id: string;
  orderId: string;
  productId: string;
  productSlug: string;
  deliverableKey: string;
  tokenHash: string;
  expiresAt: string;
  maxDownloads: number;
};

export type DownloadRecord = {
  id: string;
  orderId: string;
  productId: string;
  productSlug: string;
  deliverableKey: string;
  tokenHash: string;
  expiresAt: string;
  maxDownloads: number;
  downloadCount: number;
  revoked: boolean;
};

export type NewEmailLog = {
  orderId: string | null;
  toEmail: string;
  template: string;
  subject: string;
  status: EmailStatus;
  provider: string | null;
  error: string | null;
  payload: unknown;
};

export type EmailLogRecord = {
  id: string;
  status: EmailStatus;
};

export type EmailLogPatch = {
  status: EmailStatus;
  provider?: string | null;
  messageId?: string | null;
  error?: string | null;
  sentAt?: string | null;
};

export interface OrderStore {
  getProductBySlug(slug: string): Promise<ProductRecord | null>;
  getOrderByIdempotencyKey(key: string): Promise<OrderRecord | null>;
  createOrder(input: NewOrder): Promise<OrderRecord>;
  attachProviderOrder(orderId: string, providerOrderId: string): Promise<void>;
  getOrderByProviderOrderId(
    provider: string,
    providerOrderId: string,
  ): Promise<OrderRecord | null>;
  claimWebhookEvent(
    input: ClaimWebhookInput,
  ): Promise<{ claimed: boolean; event: WebhookEventRecord }>;
  finishWebhookEvent(
    id: string,
    status: WebhookEventStatus,
    error?: string | null,
  ): Promise<void>;
  recordPayment(input: NewPayment): Promise<void>;
  markOrderPaid(
    orderId: string,
    payment: { providerPaymentId: string },
  ): Promise<boolean>;
  markOrderFailed(orderId: string, reason?: string | null): Promise<void>;
  getDownloadByOrderId(orderId: string): Promise<DownloadRecord | null>;
  getDownloadById(downloadId: string): Promise<DownloadRecord | null>;
  createDownload(input: NewDownload): Promise<DownloadRecord>;
  /** Replaces a token after a failed fulfilment attempt. */
  rotateDownloadToken(
    downloadId: string,
    tokenHash: string,
    expiresAt: string,
  ): Promise<DownloadRecord>;
  /** Atomically claims one download attempt, or returns null when exhausted. */
  claimDownload(tokenHash: string): Promise<DownloadRecord | null>;
  logEmail(input: NewEmailLog): Promise<EmailLogRecord>;
  updateEmailLog(id: string, patch: EmailLogPatch): Promise<void>;
}

let store: OrderStore | null = null;

export function getOrderStore(): OrderStore {
  if (!store) store = new SupabaseOrderStore(getSupabaseAdmin());
  return store;
}
