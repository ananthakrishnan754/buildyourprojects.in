import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { confirmPayment } from "@/lib/payments/confirm";
import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay";
import { MemoryStore } from "@/tests/support/memory-store";

const KEY_SECRET = "test_key_secret_do_not_use";
const DOWNLOAD_SECRET = "test-download-secret";

const env = {
  PAYMENTS_PROVIDER: "razorpay",
  RAZORPAY_KEY_ID: "rzp_test_unit",
  RAZORPAY_KEY_SECRET: KEY_SECRET,
  DOWNLOAD_TOKEN_SECRET: DOWNLOAD_SECRET,
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  SUPPORT_EMAIL: "support@example.test",
} as unknown as NodeJS.ProcessEnv;

function sign(orderId: string, paymentId: string, secret = KEY_SECRET): string {
  return createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

async function setup() {
  const store = new MemoryStore();
  const product = await store.getProductBySlug("submission-kit");
  if (!product) throw new Error("fixture product missing");

  const order = await store.createOrder({
    orderNumber: "BYP-TEST-000042",
    idempotencyKey: "idem-verify-0001",
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    customerEmail: "student@college.edu",
    customerName: null,
    amountPaise: 49900,
    currency: "INR",
    provider: "razorpay",
  });

  await store.attachProviderOrder(order.id, "order_test_1");

  return { store, order };
}

describe("verifyRazorpayPaymentSignature", () => {
  it("accepts a correct order|payment signature", () => {
    const signature = sign("order_test_1", "pay_test_1");
    expect(
      verifyRazorpayPaymentSignature({
        orderId: "order_test_1",
        paymentId: "pay_test_1",
        signature,
        keySecret: KEY_SECRET,
      }),
    ).toBe(true);
  });

  it("rejects a tampered payment id", () => {
    const signature = sign("order_test_1", "pay_test_1");
    expect(
      verifyRazorpayPaymentSignature({
        orderId: "order_test_1",
        paymentId: "pay_attacker",
        signature,
        keySecret: KEY_SECRET,
      }),
    ).toBe(false);
  });

  it("rejects a signature made with the wrong secret", () => {
    const signature = sign("order_test_1", "pay_test_1", "wrong-secret");
    expect(
      verifyRazorpayPaymentSignature({
        orderId: "order_test_1",
        paymentId: "pay_test_1",
        signature,
        keySecret: KEY_SECRET,
      }),
    ).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(
      verifyRazorpayPaymentSignature({
        orderId: "order_test_1",
        paymentId: "",
        signature: "abc",
        keySecret: KEY_SECRET,
      }),
    ).toBe(false);
  });
});

describe("confirmPayment", () => {
  it("confirms a valid payment, marks the order paid and issues a download", async () => {
    const { store, order } = await setup();

    const result = await confirmPayment(
      {
        orderId: "order_test_1",
        paymentId: "pay_test_1",
        signature: sign("order_test_1", "pay_test_1"),
      },
      { store, env },
    );

    expect(result.status).toBe("confirmed");
    expect(result.orderNumber).toBe("BYP-TEST-000042");
    expect(result.downloadUrl).toContain("/api/downloads/");

    const reloaded = await store.getOrderByIdempotencyKey("idem-verify-0001");
    expect(reloaded?.status).toBe("paid");

    const download = await store.getDownloadByOrderId(order.id);
    expect(download).not.toBeNull();
  });

  it("is idempotent: replaying the handshake does not double-fulfil", async () => {
    const { store, order } = await setup();
    const signature = sign("order_test_1", "pay_test_1");

    const first = await confirmPayment(
      { orderId: "order_test_1", paymentId: "pay_test_1", signature },
      { store, env },
    );
    const second = await confirmPayment(
      { orderId: "order_test_1", paymentId: "pay_test_1", signature },
      { store, env },
    );

    expect(first.status).toBe("confirmed");
    expect(second.status).toBe("already_confirmed");

    const download = await store.getDownloadByOrderId(order.id);
    expect(download).not.toBeNull();
  });

  it("rejects a bad signature without marking the order paid", async () => {
    const { store } = await setup();

    await expect(
      confirmPayment(
        {
          orderId: "order_test_1",
          paymentId: "pay_test_1",
          signature: "0".repeat(64),
        },
        { store, env },
      ),
    ).rejects.toMatchObject({ status: 400 });

    const reloaded = await store.getOrderByIdempotencyKey("idem-verify-0001");
    expect(reloaded?.status).not.toBe("paid");
  });

  it("returns 404 for an unknown order", async () => {
    const { store } = await setup();

    const attempt = confirmPayment(
      {
        orderId: "order_does_not_exist",
        paymentId: "pay_test_1",
        signature: sign("order_does_not_exist", "pay_test_1"),
      },
      { store, env },
    );

    await expect(attempt).rejects.toBeInstanceOf(AppError);
    await expect(attempt).rejects.toMatchObject({ status: 404 });
  });
});
