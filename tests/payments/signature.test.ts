import { describe, expect, it } from "vitest";
import {
  RazorpayProvider,
  verifyRazorpaySignature,
} from "@/lib/payments/razorpay";

const BODY =
  '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_1","order_id":"order_test_1","amount":49900,"currency":"INR"}}}}';
const SECRET = "test_webhook_secret";
const SIGNATURE =
  "022b1f13bdba1209e6f062e3092e8c95234a94ebbe9ef22504339ed306eb4757";

describe("Razorpay webhook signature", () => {
  it("accepts a valid HMAC SHA-256 signature", () => {
    expect(verifyRazorpaySignature(BODY, SIGNATURE, SECRET)).toBe(true);
  });

  it("rejects a tampered body with the original signature", () => {
    const tampered = BODY.replace("order_test_1", "order_test_2");
    expect(verifyRazorpaySignature(tampered, SIGNATURE, SECRET)).toBe(false);
  });

  it("rejects the same body signed with a different secret", () => {
    expect(
      verifyRazorpaySignature(BODY, SIGNATURE, "wrong_webhook_secret"),
    ).toBe(false);
  });

  it("rejects missing or malformed signatures", () => {
    expect(verifyRazorpaySignature(BODY, null, SECRET)).toBe(false);
    expect(verifyRazorpaySignature(BODY, "", SECRET)).toBe(false);
    expect(verifyRazorpaySignature(BODY, "abc", SECRET)).toBe(false);
  });

  it("normalizes a captured payment event after verification", () => {
    const provider = new RazorpayProvider({
      keyId: "rzp_test_123",
      keySecret: "secret",
      webhookSecret: SECRET,
    });

    const result = provider.verifyWebhook(BODY, new Headers());

    // No signature header → invalid, not an exception.
    expect(result.valid).toBe(false);

    const signed = provider.verifyWebhook(
      BODY,
      new Headers({ "x-razorpay-signature": SIGNATURE }),
    );

    expect(signed.valid).toBe(true);
    if (signed.valid) {
      expect(signed.event.kind).toBe("payment_captured");
      expect(signed.event.providerOrderId).toBe("order_test_1");
      expect(signed.event.providerPaymentId).toBe("pay_1");
      expect(signed.event.amountPaise).toBe(49900);
    }
  });

  it("refuses to configure live Razorpay keys", () => {
    const provider = new RazorpayProvider({
      keyId: "rzp_live_123",
      keySecret: "secret",
      webhookSecret: SECRET,
    });

    expect(provider.isConfigured()).toBe(false);
    expect(provider.configurationErrors().join(" ")).toContain("live key");
  });
});
