import type { ProviderId } from "@/lib/config";

export type CreateOrderInput = {
  amountPaise: number;
  currency: "INR";
  /** Short human-readable reference, max 40 chars at Razorpay. */
  receipt: string;
  notes?: Record<string, string>;
};

export type ProviderOrder = {
  providerOrderId: string;
  amountPaise: number;
  currency: "INR";
  /** Public key the browser checkout script should use. */
  keyId?: string;
};

export type WebhookKind = "payment_captured" | "payment_failed" | "ignored";

export type NormalizedWebhookEvent = {
  eventId: string;
  eventType: string;
  kind: WebhookKind;
  providerOrderId?: string;
  providerPaymentId?: string;
  amountPaise?: number;
  currency?: string;
  method?: string;
  payload: unknown;
};

export type WebhookVerification =
  | { valid: true; event: NormalizedWebhookEvent }
  | { valid: false; reason: string };

export type RefundInput = {
  providerPaymentId: string;
  amountPaise?: number;
  notes?: Record<string, string>;
};

export type RefundResult = {
  refundId: string;
  status: string;
  amountPaise: number;
};

export interface PaymentProvider {
  readonly id: ProviderId;
  readonly displayName: string;
  isConfigured(): boolean;
  configurationErrors(): string[];
  createOrder(input: CreateOrderInput): Promise<ProviderOrder>;
  /**
   * Verify the raw request body. Implementations must never parse-then-verify
   * or trust a JSON body before the signature check.
   */
  verifyWebhook(rawBody: string, headers: Headers): WebhookVerification;
  refund(input: RefundInput): Promise<RefundResult>;
}
