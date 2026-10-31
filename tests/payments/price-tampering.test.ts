import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { startCheckout, type CheckoutDeps } from "@/lib/payments/checkout";
import { StubProvider } from "@/lib/payments/stub";
import { MemoryStore } from "@/tests/support/memory-store";

function deps(store: MemoryStore): CheckoutDeps {
  return {
    store,
    provider: new StubProvider({ secret: "test-stub-secret", nodeEnv: "test" }),
  };
}

async function expectCode(
  fn: () => Promise<unknown>,
  code: string,
): Promise<void> {
  try {
    await fn();
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).code).toBe(code);
    return;
  }
  throw new Error(`Expected ${code}, but nothing was thrown`);
}

describe("checkout price and input validation", () => {
  it("uses the server price for a valid request", async () => {
    const store = new MemoryStore();
    const session = await startCheckout(
      { productSlug: "submission-kit", email: "Student@College.edu" },
      deps(store),
    );

    expect(session.amountPaise).toBe(49900);
    expect(session.prefill.email).toBe("student@college.edu");
    expect(session.product.name).toBe("Submission Kit");
    expect(session.idempotent).toBe(false);

    const [order] = [...store.orders.values()];
    expect(order?.amountPaise).toBe(49900);
    expect(order?.customerEmail).toBe("student@college.edu");
  });

  it("rejects a client-supplied amount below the server price", async () => {
    await expectCode(
      () =>
        startCheckout(
          {
            productSlug: "submission-kit",
            email: "student@college.edu",
            pricePaise: 100,
          },
          deps(new MemoryStore()),
        ),
      "price_mismatch",
    );
  });

  it("accepts a client-supplied amount only when it equals the server price", async () => {
    const session = await startCheckout(
      {
        productSlug: "reportforge",
        email: "student@college.edu",
        pricePaise: 29900,
      },
      deps(new MemoryStore()),
    );

    expect(session.amountPaise).toBe(29900);
  });

  it("never writes an order when the price is rejected", async () => {
    const store = new MemoryStore();

    await expectCode(
      () =>
        startCheckout(
          {
            productSlug: "viva-vault",
            email: "student@college.edu",
            pricePaise: 1,
          },
          deps(store),
        ),
      "price_mismatch",
    );

    expect(store.orders.size).toBe(0);
  });

  it("rejects unknown products", async () => {
    await expectCode(
      () =>
        startCheckout(
          { productSlug: "free-money", email: "student@college.edu" },
          deps(new MemoryStore()),
        ),
      "unknown_product",
    );
  });

  it("rejects invalid email addresses", async () => {
    await expectCode(
      () =>
        startCheckout(
          { productSlug: "viva-vault", email: "not-an-email" },
          deps(new MemoryStore()),
        ),
      "invalid_email",
    );
  });

  it("reuses the existing order for a repeated idempotency key", async () => {
    const store = new MemoryStore();
    const ctx = deps(store);
    const input = {
      productSlug: "submission-kit",
      email: "student@college.edu",
      idempotencyKey: "checkout-test-key-1",
    };

    const first = await startCheckout(input, ctx);
    const second = await startCheckout(input, ctx);

    expect(first.idempotent).toBe(false);
    expect(second.idempotent).toBe(true);
    expect(second.orderNumber).toBe(first.orderNumber);
    expect(second.providerOrderId).toBe(first.providerOrderId);
    expect(store.orders.size).toBe(1);
  });
});
