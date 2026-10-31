import { randomBytes, randomUUID } from "node:crypto";
import { getProduct } from "@/data/products";
import { AppError } from "@/lib/errors";
import type { PaymentProvider } from "@/lib/payments/provider";
import type { OrderRecord, OrderStore } from "@/lib/payments/store";

export type CheckoutInput = {
  productSlug: string;
  email: string;
  name?: string | null;
  idempotencyKey?: string | null;
  /** Optional client-observed price, used only to detect drift. */
  pricePaise?: number | null;
};

export type CheckoutDeps = {
  store: OrderStore;
  provider: PaymentProvider;
  now?: () => Date;
};

export type CheckoutSession = {
  orderNumber: string;
  provider: string;
  providerOrderId: string;
  amountPaise: number;
  currency: "INR";
  keyId?: string;
  product: { slug: string; name: string };
  prefill: { email: string; name?: string };
  idempotent: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const KEY_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

function normaliseEmail(value: string): string {
  const email = value.trim().toLowerCase();

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw new AppError("invalid_email", 400, "Enter a valid email address");
  }

  return email;
}

function normaliseName(value: string | null | undefined): string | null {
  if (!value) return null;
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return null;
  if (name.length > 120) {
    throw new AppError("bad_request", 400, "Name must be 120 characters or fewer");
  }
  return name;
}

function normaliseIdempotencyKey(value: string | null | undefined): string {
  const key = value?.trim();

  if (!key) return randomUUID();

  if (!KEY_PATTERN.test(key)) {
    throw new AppError(
      "bad_request",
      400,
      "Idempotency-Key must be 8–128 characters of letters, digits, dot, colon, underscore or hyphen",
    );
  }

  return key;
}

function orderNumber(now: Date): string {
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `BYP-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function sessionFromExisting(
  order: OrderRecord,
  productName: string,
  idempotent: boolean,
): CheckoutSession {
  if (!order.providerOrderId) {
    throw new AppError(
      "gateway_error",
      502,
      "This order is still waiting for a gateway order. Retry the request.",
      { orderNumber: order.orderNumber },
    );
  }

  return {
    orderNumber: order.orderNumber,
    provider: order.provider,
    providerOrderId: order.providerOrderId,
    amountPaise: order.amountPaise,
    currency: order.currency,
    product: { slug: order.productSlug, name: productName },
    prefill: {
      email: order.customerEmail,
      ...(order.customerName ? { name: order.customerName } : {}),
    },
    idempotent,
  };
}

/**
 * Server-side checkout. The client never supplies a trusted price: the amount
 * comes from `data/products.ts`, and a disagreeing client price is rejected.
 */
export async function startCheckout(
  input: CheckoutInput,
  deps: CheckoutDeps,
): Promise<CheckoutSession> {
  const product = getProduct(input.productSlug);

  if (!product) {
    throw new AppError("unknown_product", 404, "Unknown product");
  }

  const email = normaliseEmail(input.email);
  const name = normaliseName(input.name);
  const idempotencyKey = normaliseIdempotencyKey(input.idempotencyKey);
  const amountPaise = product.price * 100;

  if (
    input.pricePaise !== undefined &&
    input.pricePaise !== null &&
    input.pricePaise !== amountPaise
  ) {
    throw new AppError("price_mismatch", 400, "The product price changed. Refresh and try again.", {
      expectedPaise: amountPaise,
      receivedPaise: input.pricePaise,
    });
  }

  const existing = await deps.store.getOrderByIdempotencyKey(idempotencyKey);

  if (existing) {
    return sessionFromExisting(existing, product.name, true);
  }

  const catalogProduct = await deps.store.getProductBySlug(product.slug);

  if (!catalogProduct) {
    throw new AppError(
      "storage_not_configured",
      503,
      "The product catalog is not seeded. Run the Supabase migrations before taking checkout.",
      { missing: "products row", slug: product.slug },
    );
  }

  if (!catalogProduct.active) {
    throw new AppError("unknown_product", 404, "This product is not on sale");
  }

  const now = deps.now ? deps.now() : new Date();

  let order: OrderRecord;

  try {
    order = await deps.store.createOrder({
      orderNumber: orderNumber(now),
      idempotencyKey,
      productId: catalogProduct.id,
      productSlug: product.slug,
      productName: product.name,
      customerEmail: email,
      customerName: name,
      amountPaise,
      currency: "INR",
      provider: deps.provider.id,
    });
  } catch (error) {
    // A concurrent request may have created the same idempotency key.
    const raced = await deps.store.getOrderByIdempotencyKey(idempotencyKey);
    if (raced) return sessionFromExisting(raced, product.name, true);
    throw error;
  }

  const providerOrder = await deps.provider.createOrder({
    amountPaise,
    currency: "INR",
    receipt: order.orderNumber,
    notes: {
      orderNumber: order.orderNumber,
      productSlug: product.slug,
      customerEmail: email,
    },
  });

  await deps.store.attachProviderOrder(order.id, providerOrder.providerOrderId);

  return {
    orderNumber: order.orderNumber,
    provider: deps.provider.id,
    providerOrderId: providerOrder.providerOrderId,
    amountPaise: providerOrder.amountPaise,
    currency: providerOrder.currency,
    ...(providerOrder.keyId ? { keyId: providerOrder.keyId } : {}),
    product: { slug: product.slug, name: product.name },
    prefill: { email, ...(name ? { name } : {}) },
    idempotent: false,
  };
}
