import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/config";
import { StorageConfigError } from "@/lib/errors";

let client: SupabaseClient | null = null;

/**
 * Service-role Supabase client. Server route handlers only.
 * The service role bypasses RLS, so this module must never be imported into a
 * client component.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const config = getSupabaseConfig();

  if (!config.configured || !config.url || !config.serviceRoleKey) {
    throw new StorageConfigError(
      `Supabase is not configured (missing ${config.missing.join(", ")})`,
      { missing: config.missing },
    );
  }

  client = createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { "x-application-name": "buildyourprojects-storefront" },
    },
  });

  return client;
}
