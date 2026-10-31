import { describe, expect, it } from "vitest";
import { StubProvider, stubSignature } from "@/lib/payments/stub";
import { handleWebhook, type WebhookDeps } from "@/lib/payments/webhook";
import { MemoryStore } from "@/tests/support/memory-store";

const STUB_SECRET = "test-stub-secret";
const DOWNLOAD_SECRET = "test-download-secret";

const CAPTURED = {
  event: "payment.captured",
  order_id: "stub_order_1",
  payment_id: "pay_1",
  amount: 49900,
  currency: "INR",
  method: "upi",
};

async function setup() {
  const store = new MemoryStore();
  const product = await store.getProductBySlug("submission-kit");

  if (!product) throw new Error("fixture product missing");

  const order = await store.createOrder({
    orderNumber: "BYP-TEST-000001",
    idempotencyKey: "idem-test-0001",
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    customerEmail: "student@college.edu",
    customerName: null,
    amountPaise: 49900,
    currency: "INR",
    provider: "stub",
  });

  await store.attachProviderOrder(order.id, "stub_order_1");

  const provider = new StubProvider({
    secret: STUB_SECRET,
    nodeEnv: "test",
  });

  const deps: WebhookDeps = {
    store,
    provider,
    mailer: null,
    downloadConfig: {
      secret: DOWNLOAD_SECRET,
      configured: true,
      ttlHours: 72,
      maxAttempts: 5,
      missing: [],
    },
    siteUrl: "https://www.buildyourprojects.xyz",
    supportEmail: "support@buildyourprojects.xyz",
  };

  return { store, order, provider, deps };
}

function signed(body: object, eventId: string) {
  const rawBody = JSON.stringify(body);

  return {
    rawBody,
    headers: new Headers({
      "x-stub-signature": stubSignature(rawBody, STUB_SECRET),
      "x-stub-event-id": eventId,
    }),
  };
}

describe("webhook replay safety", () => {
  it("processes the same event id exactly once", async () => {
    const ctx = await setup();
    const request = signed(CAPTURED, "evt_same");

    const first = await handleWebhook(request, ctx.deps);

    expect(first.status).toBe("processed");
    expect(first.emailStatus).toBe("queued");
    expect(ctx.store.downloads).toHaveLength(1);
    expect(ctx.store.emails).toHaveLength(1);
    expect((await ctx.store.getOrderByProviderOrderId("stub", "stub_order_1"))?.status).toBe(
      "paid",
    );

    const second = await handleWebhook(request, ctx.deps);

    expect(second.status).toBe("duplicate");
    expect(ctx.store.downloads).toHaveLength(1);
    expect(ctx.store.emails).toHaveLength(1);
    expect(ctx.store.webhookEvents).toHaveLength(1);
  });

  it("never double-fulfils two different event ids for the same payment", async () => {
    const ctx = await setup();

    const one = await handleWebhook(signed(CAPTURED, "evt_a"), ctx.deps);
    const two = await handleWebhook(signed(CAPTURED, "evt_b"), ctx.deps);

    expect(one.status).toBe("processed");
    expect(two.status).toBe("duplicate");
    expect(ctx.store.downloads).toHaveLength(1);
    expect(ctx.store.emails).toHaveLength(1);
    expect(ctx.store.webhookEvents).toHaveLength(2);
  });

  it("rejects a signed webhook whose amount does not match the order", async () => {
    const ctx = await setup();
    const result = await handleWebhook(
      signed({ ...CAPTURED, amount: 100 }, "evt_bad"),
      ctx.deps,
    );

    expect(result.status).toBe("amount_mismatch");
    expect(ctx.store.downloads).toHaveLength(0);
    expect((await ctx.store.getOrderByProviderOrderId("stub", "stub_order_1"))?.status).toBe(
      "pending",
    );
  });

  it("rejects a tampered body before claiming the event", async () => {
    const ctx = await setup();
    const { rawBody, headers } = signed(CAPTURED, "evt_tampered");
    const tampered = rawBody.replace("49900", "100");

    await expect(
      handleWebhook({ rawBody: tampered, headers }, ctx.deps),
    ).rejects.toMatchObject({ code: "invalid_signature" });

    expect(ctx.store.webhookEvents).toHaveLength(0);
    expect(ctx.store.downloads).toHaveLength(0);
  });

  it("marks the order failed on a payment.failed event", async () => {
    const ctx = await setup();
    const result = await handleWebhook(
      signed({ ...CAPTURED, event: "payment.failed" }, "evt_failed"),
      ctx.deps,
    );

    expect(result.status).toBe("payment_failed");
    expect(ctx.store.downloads).toHaveLength(0);
    expect((await ctx.store.getOrderByProviderOrderId("stub", "stub_order_1"))?.status).toBe(
      "failed",
    );
  });

  it("ignores unrelated event types without fulfilling", async () => {
    const ctx = await setup();
    const result = await handleWebhook(
      signed({ ...CAPTURED, event: "payment.authorized" }, "evt_ignored"),
      ctx.deps,
    );

    expect(result.status).toBe("ignored");
    expect(ctx.store.downloads).toHaveLength(0);
    expect((await ctx.store.getOrderByProviderOrderId("stub", "stub_order_1"))?.status).toBe(
      "pending",
    );
  });
});
