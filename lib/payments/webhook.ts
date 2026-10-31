import type { Mailer } from "@/lib/email/mailer";
import { AppError, SignatureError } from "@/lib/errors";
import type { PaymentProvider } from "@/lib/payments/provider";
import {
  fulfilPaidOrder,
  type FulfilmentDeps,
} from "@/lib/payments/fulfilment";
import type { OrderStore } from "@/lib/payments/store";

export type WebhookDeps = {
  store: OrderStore;
  provider: PaymentProvider;
  mailer: Mailer | null;
  downloadConfig: FulfilmentDeps["downloadConfig"];
  siteUrl: string;
  supportEmail: string;
  now?: () => Date;
};

export type WebhookOutcome = {
  status:
    | "processed"
    | "ignored"
    | "duplicate"
    | "payment_failed"
    | "amount_mismatch"
    | "order_not_found"
    | "invalid_event";
  eventType: string;
  eventId: string;
  orderNumber?: string;
  emailStatus?: string;
};

/**
 * Signature check, replay claim, guarded state transition and fulfilment.
 * The browser callback is never involved; this is the only fulfilment trigger.
 */
export async function handleWebhook(
  input: { rawBody: string; headers: Headers },
  deps: WebhookDeps,
): Promise<WebhookOutcome> {
  const verification = deps.provider.verifyWebhook(input.rawBody, input.headers);

  if (!verification.valid) {
    throw new SignatureError(verification.reason);
  }

  const event = verification.event;

  const claim = await deps.store.claimWebhookEvent({
    provider: deps.provider.id,
    eventId: event.eventId,
    eventType: event.eventType,
    signatureValid: true,
    payload: event.payload,
  });

  if (!claim.claimed) {
    return {
      status: "duplicate",
      eventType: event.eventType,
      eventId: event.eventId,
    };
  }

  const finish = async (
    status: Parameters<OrderStore["finishWebhookEvent"]>[1],
    error?: string | null,
  ) => deps.store.finishWebhookEvent(claim.event.id, status, error);

  try {
    if (event.kind === "ignored") {
      await finish("ignored");
      return {
        status: "ignored",
        eventType: event.eventType,
        eventId: event.eventId,
      };
    }

    if (!event.providerOrderId) {
      await finish("failed", "Webhook has no order reference");
      return {
        status: "invalid_event",
        eventType: event.eventType,
        eventId: event.eventId,
      };
    }

    const order = await deps.store.getOrderByProviderOrderId(
      deps.provider.id,
      event.providerOrderId,
    );

    if (!order) {
      await finish("failed", "Order not found for gateway order");
      console.error(
        `[payments] webhook ${event.eventId}: order ${event.providerOrderId} not found`,
      );
      return {
        status: "order_not_found",
        eventType: event.eventType,
        eventId: event.eventId,
      };
    }

    if (
      event.amountPaise !== undefined &&
      event.amountPaise !== order.amountPaise
    ) {
      const message = `Amount mismatch: gateway ${event.amountPaise}, order ${order.amountPaise}`;
      await finish("failed", message);
      console.error(`[payments] webhook ${event.eventId}: ${message}`);
      return {
        status: "amount_mismatch",
        eventType: event.eventType,
        eventId: event.eventId,
        orderNumber: order.orderNumber,
      };
    }

    if (event.kind === "payment_failed") {
      await deps.store.markOrderFailed(order.id, "gateway payment failed");

      if (event.providerPaymentId) {
        await deps.store.recordPayment({
          orderId: order.id,
          provider: deps.provider.id,
          providerOrderId: event.providerOrderId,
          providerPaymentId: event.providerPaymentId,
          amountPaise: event.amountPaise ?? order.amountPaise,
          currency: "INR",
          status: "failed",
          method: event.method ?? null,
          rawEventId: event.eventId,
        });
      }

      await finish("processed");
      return {
        status: "payment_failed",
        eventType: event.eventType,
        eventId: event.eventId,
        orderNumber: order.orderNumber,
      };
    }

    if (!event.providerPaymentId) {
      await finish("failed", "Captured payment has no payment id");
      return {
        status: "invalid_event",
        eventType: event.eventType,
        eventId: event.eventId,
      };
    }

    await deps.store.recordPayment({
      orderId: order.id,
      provider: deps.provider.id,
      providerOrderId: event.providerOrderId,
      providerPaymentId: event.providerPaymentId,
      amountPaise: event.amountPaise ?? order.amountPaise,
      currency: "INR",
      status: "captured",
      method: event.method ?? null,
      rawEventId: event.eventId,
    });

    const transitioned = await deps.store.markOrderPaid(order.id, {
      providerPaymentId: event.providerPaymentId,
    });

    if (!transitioned) {
      if (order.status === "paid") {
        const existingDownload = await deps.store.getDownloadByOrderId(order.id);

        if (!existingDownload) {
          // Recovery path: a previous attempt paid the order but failed before
          // fulfilment. Generate a fresh token and try again.
          const product = await deps.store.getProductBySlug(order.productSlug);

          if (!product) {
            throw new AppError(
              "storage_not_configured",
              503,
              "Order product is missing from the catalog",
              { slug: order.productSlug },
            );
          }

          const result = await fulfilPaidOrder(
            { order, product },
            {
              store: deps.store,
              mailer: deps.mailer,
              downloadConfig: deps.downloadConfig,
              siteUrl: deps.siteUrl,
              supportEmail: deps.supportEmail,
              now: deps.now,
            },
          );

          await finish("processed");
          return {
            status: "processed",
            eventType: event.eventType,
            eventId: event.eventId,
            orderNumber: order.orderNumber,
            emailStatus: result.emailStatus,
          };
        }

        await finish("processed");
        return {
          status: "duplicate",
          eventType: event.eventType,
          eventId: event.eventId,
          orderNumber: order.orderNumber,
        };
      }

      await finish("ignored", `Order status is ${order.status}`);
      return {
        status: "ignored",
        eventType: event.eventType,
        eventId: event.eventId,
        orderNumber: order.orderNumber,
      };
    }

    const product = await deps.store.getProductBySlug(order.productSlug);

    if (!product) {
      throw new AppError(
        "storage_not_configured",
        503,
        "Order product is missing from the catalog",
        { slug: order.productSlug },
      );
    }

    const result = await fulfilPaidOrder(
      { order, product },
      {
        store: deps.store,
        mailer: deps.mailer,
        downloadConfig: deps.downloadConfig,
        siteUrl: deps.siteUrl,
        supportEmail: deps.supportEmail,
        now: deps.now,
      },
    );

    await finish("processed");

    return {
      status: "processed",
      eventType: event.eventType,
      eventId: event.eventId,
      orderNumber: order.orderNumber,
      emailStatus: result.emailStatus,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";
    await deps.store.finishWebhookEvent(claim.event.id, "failed", message);
    throw error;
  }
}
