export type ProviderId = "razorpay" | "stub";

export type PaymentConfig = {
  /** Provider selected by env, even if it is not usable yet. */
  requested: string | null;
  /** Usable provider, or null when checkout must stay closed. */
  provider: ProviderId | null;
  enabled: boolean;
  /** Human-readable reason shown in logs when checkout is closed. */
  reason: string;
  missing: string[];
  /** Always true in Phase 4. Present code executes only against test APIs. */
  testMode: boolean;
};

const LIVE_KEY_PREFIX = "rzp_live_";
const TEST_KEY_PREFIX = "rzp_test_";

function read(env: NodeJS.ProcessEnv, name: string): string | undefined {
  const value = env[name]?.trim();
  return value ? value : undefined;
}

export function readPaymentConfig(
  env: NodeJS.ProcessEnv = process.env,
): PaymentConfig {
  const requested = read(env, "PAYMENTS_PROVIDER")?.toLowerCase() ?? null;

  if (!requested) {
    return {
      requested,
      provider: null,
      enabled: false,
      reason: "PAYMENTS_PROVIDER is not set",
      missing: ["PAYMENTS_PROVIDER"],
      testMode: true,
    };
  }

  if (requested === "stub") {
    if (env.NODE_ENV === "production") {
      return {
        requested,
        provider: null,
        enabled: false,
        reason: "The stub provider is disabled in production",
        missing: [],
        testMode: true,
      };
    }

    return {
      requested,
      provider: "stub",
      enabled: true,
      reason: "Local stub provider: no money is charged",
      missing: [],
      testMode: true,
    };
  }

  if (requested !== "razorpay") {
    return {
      requested,
      provider: null,
      enabled: false,
      reason: `Unsupported PAYMENTS_PROVIDER "${requested}"`,
      missing: [],
      testMode: true,
    };
  }

  // Checkout needs the key pair. The webhook secret only gates webhook
  // verification, so a captured payment can still be confirmed out-of-band by
  // the browser handshake at /api/verify-payment.
  const required = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"].filter(
    (name) => !read(env, name),
  );
  const missing = [
    ...required,
    ...["RAZORPAY_WEBHOOK_SECRET"].filter((name) => !read(env, name)),
  ];

  const keyId = read(env, "RAZORPAY_KEY_ID");

  if (keyId?.startsWith(LIVE_KEY_PREFIX)) {
    return {
      requested,
      provider: null,
      enabled: false,
      reason:
        "Refusing a live Razorpay key. Phase 4 is test mode only; rotate the key and use rzp_test_…",
      missing,
      testMode: true,
    };
  }

  if (keyId && !keyId.startsWith(TEST_KEY_PREFIX)) {
    return {
      requested,
      provider: null,
      enabled: false,
      reason: "RAZORPAY_KEY_ID is not a test key (expected rzp_test_…)",
      missing,
      testMode: true,
    };
  }

  if (required.length > 0) {
    return {
      requested,
      provider: null,
      enabled: false,
      reason: `Razorpay test keys are not configured (missing ${required.join(", ")})`,
      missing,
      testMode: true,
    };
  }

  return {
    requested,
    provider: "razorpay",
    enabled: true,
    reason:
      missing.length > 0
        ? `Razorpay test mode (webhook verification off: ${missing.join(", ")} missing)`
        : "Razorpay test mode",
    missing,
    testMode: true,
  };
}

export function getPaymentConfig(): PaymentConfig {
  return readPaymentConfig(process.env);
}

export function getSupabaseConfig(env: NodeJS.ProcessEnv = process.env) {
  const url = (read(env, "NEXT_PUBLIC_SUPABASE_URL") ?? read(env, "SUPABASE_URL"))?.replace(
    /\/$/,
    "",
  );
  const serviceRoleKey = read(env, "SUPABASE_SERVICE_ROLE_KEY");
  const missing: string[] = [];

  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  return { url, serviceRoleKey, missing, configured: missing.length === 0 };
}

export function getDownloadConfig(env: NodeJS.ProcessEnv = process.env) {
  const secret = read(env, "DOWNLOAD_TOKEN_SECRET");
  const ttlHours = Number(read(env, "DOWNLOAD_TTL_HOURS") ?? "72");
  const maxAttempts = Number(read(env, "DOWNLOAD_MAX_ATTEMPTS") ?? "5");

  return {
    secret,
    configured: Boolean(secret),
    ttlHours: Number.isFinite(ttlHours) && ttlHours > 0 ? ttlHours : 72,
    maxAttempts:
      Number.isInteger(maxAttempts) && maxAttempts > 0 ? maxAttempts : 5,
    missing: secret ? [] : ["DOWNLOAD_TOKEN_SECRET"],
  };
}

export function getSiteUrl(env: NodeJS.ProcessEnv = process.env): string {
  return read(env, "NEXT_PUBLIC_SITE_URL") ?? "https://www.buildyourprojects.xyz";
}

export function getSupportEmail(
  env: NodeJS.ProcessEnv = process.env,
): string {
  return read(env, "SUPPORT_EMAIL") ?? "buildyourprojects754@gmail.com";
}

export function getFromAddress(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return read(env, "MAIL_FROM");
}
