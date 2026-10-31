import { NextResponse } from "next/server";
import {
  getDownloadConfig,
  getPaymentConfig,
  getSupabaseConfig,
} from "@/lib/config";
import { selectMailer } from "@/lib/email/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lets the buy panel enable itself after deployment without baking env values
 * into a statically rendered product page.
 */
export function GET() {
  const payments = getPaymentConfig();
  const storage = getSupabaseConfig();
  const delivery = getDownloadConfig();
  const mailer = selectMailer();

  return NextResponse.json(
    {
      enabled: payments.enabled && storage.configured && delivery.configured,
      payments: {
        provider: payments.provider,
        testMode: payments.testMode,
        reason: payments.reason,
      },
      storage: {
        configured: storage.configured,
        missing: storage.missing,
      },
      delivery: {
        configured: delivery.configured,
        missing: delivery.missing,
      },
      email: {
        configured: Boolean(mailer.mailer),
        provider: mailer.mailer?.id ?? null,
        reason: mailer.reason,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
