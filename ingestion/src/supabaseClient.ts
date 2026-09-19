// Supabase client for server-side ingestion jobs.
//
// This uses the SERVICE ROLE key on purpose: ingestion scripts run in a
// trusted server/CI context (never in a browser) and need to bypass Row
// Level Security to upsert listings, price history, and ratings. Never
// import this module from browser-facing code, and never commit a real
// value for SUPABASE_SERVICE_ROLE_KEY.
import "dotenv/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Returns true if the minimum env vars needed to talk to Supabase's REST
 * API are present. Ingestion scripts use this to decide whether to do a
 * real write or fall back to a dry-run that only logs what would happen.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Lazily creates (and caches) a Supabase client authenticated with the
 * service role key. Throws a clear error if the required env vars are
 * missing — call `isSupabaseConfigured()` first if you want to branch
 * into a dry-run instead of throwing.
 */
export function getSupabaseClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
        "in your environment (see ingestion/.env.example). These come from the " +
        "Supabase project dashboard under Settings -> API."
    );
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
