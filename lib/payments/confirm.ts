import { AppError } from "@/lib/errors";
import {
  getDownloadConfig,
  getSiteUrl,
  getSupportEmail,
  readPaymentConfig,
} from "@/lib/config";
import { selectMailer } from "@/lib/email/registry";
import { fulfilPaidOrder } from "@/lib/payments/fulfilment";
import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay";
import { getOrderStore, type OrderStore } from "@/lib/payments/store";

export type ConfirmPaymentInput = {
  orderId: string;
  paymentId: string;
  signature: string;
};

export type ConfirmPaymentResult = {
  status: "confirmed" | "already_confirmed";
  orderNumber: string;
  downloadUrl?: string;
  expiresAt?: string;
  emailStatus?: string;
};

/**
 * Confirms a Standard Checkout payment from the browser handshake.
 *
 * This is the out-of-band path that runs when a webhook is not (yet) available:
 * the signature is verified server-side with KEY_SECRET, the order is marked
 * paid at most once, and delivery is issued. Replaying the same handshake is
 * idempotent and never double-fulfils.
 */
export async function confirmPayment(
  input: ConfirmPaymentInput,
  deps: { store?: OrderStore; env?: NodeJS.ProcessEnv } = {},
): Promise<ConfirmPaymentResult> {
  const env = deps.env ?? process.env;
  const config = readPaymentConfig(env);

  if (!config.enabled || config.provider !== "razorpay") {
    throw new AppError(
      "payments_not_configured",
      503,
      config.reason || "Payments are not configured",
    );
  }

  const keySecret = env.RAZORPAY_KEY_SECRET?.trim();

  if (!keySecret) {
    throw new AppError(
      "payments_not_configured",
      503,
      "RAZORPAY_KEY_SECRET is not configured",
    );
  }

  const verified = verifyRazorpayPaymentSignature({
    orderId: input.orderId,
    paymentId: input.paymentId,
    signature: input.signature,
    keySecret,
  });

  if (!verified) {
    // Never mark anything paid on a bad signature.
    throw new AppError(
      "invalid_signature",
      400,
      "Payment signature verification failed",
    );
  }

  const store = deps.store ?? getOrderStore();
  const order = await store.getOrderByProviderOrderId("razorpay", input.orderId);

  if (!order) {
    throw new AppError("not_found", 404, "Unknown order");
  }

  if (order.status === "paid") {
    const download = await store.getDownloadByOrderId(order.id);

    return {
      status: "already_confirmed",
      orderNumber: order.orderNumber,
      expiresAt: download?.expiresAt,
    };
  }

  await store.recordPayment({
    orderId: order.id,
    provider: "razorpay",
    providerOrderId: input.orderId,
    providerPaymentId: input.paymentId,
    amountPaise: order.amountPaise,
    currency: "INR",
    status: "captured",
    method: null,
    rawEventId: `verify:${input.paymentId}`,
  });

  const transitioned = await store.markOrderPaid(order.id, {
    providerPaymentId: input.paymentId,
  });

  if (!transitioned) {
    return { status: "already_confirmed", orderNumber: order.orderNumber };
  }

  const product = await store.getProductBySlug(order.productSlug);

  if (!product) {
    throw new AppError(
      "storage_not_configured",
      503,
      "Order product is missing from the catalog",
      { slug: order.productSlug },
    );
  }

  const fulfilment = await fulfilPaidOrder(
    { order, product },
    {
      store,
      mailer: selectMailer().mailer,
      downloadConfig: getDownloadConfig(env),
      siteUrl: getSiteUrl(env),
      supportEmail: getSupportEmail(env),
    },
  );

  return {
    status: "confirmed",
    orderNumber: order.orderNumber,
    downloadUrl: fulfilment.downloadUrl,
    expiresAt: fulfilment.expiresAt,
    emailStatus: fulfilment.emailStatus,
  };
}
