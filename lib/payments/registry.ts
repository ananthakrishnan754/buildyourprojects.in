import { getPaymentConfig } from "@/lib/config";
import type { PaymentProvider } from "@/lib/payments/provider";
import { RazorpayProvider } from "@/lib/payments/razorpay";
import { StubProvider } from "@/lib/payments/stub";

function build(provider: "razorpay" | "stub"): PaymentProvider {
  if (provider === "stub") {
    return new StubProvider({
      secret: process.env.PAYMENTS_STUB_SECRET,
      nodeEnv: process.env.NODE_ENV,
    });
  }

  return new RazorpayProvider({
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  });
}

/**
 * Returns the usable provider, or null when checkout must stay closed.
 * Incomplete key sets never fall back to another provider.
 */
export function getPaymentProvider(): PaymentProvider | null {
  const config = getPaymentConfig();

  if (!config.enabled || !config.provider) {
    if (config.provider === null && config.requested) {
      console.warn(`[payments] closed: ${config.reason}`);
    }
    return null;
  }

  const provider = build(config.provider);
  return provider.isConfigured() ? provider : null;
}

export function getPaymentProviderById(
  providerId: string,
): PaymentProvider | null {
  const config = getPaymentConfig();

  if (config.provider !== providerId || !config.enabled) return null;

  const provider = build(config.provider);
  return provider.isConfigured() ? provider : null;
}
