// Shared upsert logic implementing the "Deduplication" strategy documented
// in integrations/DATA_SOURCES.md:
//   1. Upsert on (platform_id, external_id)
//   2. If price_eur changed, insert a row into price_history
//   3. Set last_seen_at = NOW()
// (Step 4, marking listings unseen for 7+ days as inactive, is a separate
// sweep-cleanup job per platform and out of scope for a single-source
// ingestion run -- see README "Follow-ups".)
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NormalizedListing } from "./types.js";

export interface UpsertResult {
  external_id: string;
  action: "inserted" | "updated";
  priceChanged: boolean;
  error?: string;
}

export async function upsertListing(
  supabase: SupabaseClient,
  listing: NormalizedListing
): Promise<UpsertResult> {
  const nowIso = new Date().toISOString();

  // 1. Look up any existing row for this (platform_id, external_id) so we
  //    can detect a price change before we overwrite it.
  const { data: existing, error: selectError } = await supabase
    .from("listings")
    .select("id, price_eur")
    .eq("platform_id", listing.platform_id)
    .eq("external_id", listing.external_id)
    .maybeSingle();

  if (selectError) {
    return { external_id: listing.external_id, action: "inserted", priceChanged: false, error: selectError.message };
  }

  const row = {
    external_id: listing.external_id,
    platform_id: listing.platform_id,
    car_model_id: listing.car_model_id,
    title: listing.title,
    url: listing.url,
    price_eur: listing.price_eur,
    year: listing.year,
    mileage_km: listing.mileage_km,
    condition: listing.condition,
    transmission: listing.transmission ?? null,
    country_code: listing.country_code ?? null,
    city: listing.city ?? null,
    region: listing.region ?? null,
    exterior_color: listing.exterior_color ?? null,
    interior_color: listing.interior_color ?? null,
    doors: listing.doors ?? null,
    power_kw: listing.power_kw ?? null,
    engine_cc: listing.engine_cc ?? null,
    raw_data: listing.raw_data ?? null,
    last_seen_at: nowIso,
    last_scraped_at: nowIso,
    is_active: true,
  };

  // 2. Upsert the row itself.
  const { data: upserted, error: upsertError } = await supabase
    .from("listings")
    .upsert(row, { onConflict: "platform_id,external_id" })
    .select("id")
    .single();

  if (upsertError || !upserted) {
    return {
      external_id: listing.external_id,
      action: "inserted",
      priceChanged: false,
      error: upsertError?.message ?? "upsert returned no row",
    };
  }

  // 3. If the price changed (or this is a brand-new listing), record it in
  //    price_history so the price timeline is queryable later.
  const priceChanged = !existing || existing.price_eur !== listing.price_eur;
  if (priceChanged) {
    const { error: historyError } = await supabase
      .from("price_history")
      .insert({ listing_id: upserted.id, price_eur: listing.price_eur, recorded_at: nowIso });
    if (historyError) {
      return {
        external_id: listing.external_id,
        action: existing ? "updated" : "inserted",
        priceChanged,
        error: `price_history insert failed: ${historyError.message}`,
      };
    }
  }

  return { external_id: listing.external_id, action: existing ? "updated" : "inserted", priceChanged };
}
