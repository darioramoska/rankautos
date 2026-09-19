// Helpers for matching an incoming listing to a row in `car_models`.
//
// This is intentionally simple: it only covers the case ingestion sources
// need today (matching a brand + a slug pattern, e.g. Tesla "my" ->
// car_models rows whose slug looks like 'tesla-model-y%'). Full
// scraped-listing matching against arbitrary make/model strings (as
// described in DATA_SOURCES.md's "Data Quality & Matching" section, via a
// platform_model_map table) is a follow-up once real scraped sources
// beyond Tesla/NCAP are in play.
import type { SupabaseClient } from "@supabase/supabase-js";

const cache = new Map<string, number | null>();

/**
 * Finds a car_models.id for the given brand slug (e.g. 'tesla') whose
 * car_models.slug matches the given SQL ILIKE pattern (e.g. 'tesla-model-y%').
 * Returns null (not an error) if no brand or no matching model exists yet --
 * callers should leave car_model_id null and let a human backfill it, per
 * the ingestion brief.
 */
export async function findCarModelIdBySlugPattern(
  supabase: SupabaseClient,
  brandSlug: string,
  slugPattern: string
): Promise<number | null> {
  const cacheKey = `${brandSlug}::${slugPattern}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", brandSlug)
    .maybeSingle();

  if (brandError || !brand) {
    cache.set(cacheKey, null);
    return null;
  }

  const { data: models, error: modelError } = await supabase
    .from("car_models")
    .select("id, slug")
    .eq("brand_id", brand.id)
    .ilike("slug", slugPattern)
    .limit(1);

  const result = !modelError && models && models.length > 0 ? models[0].id : null;
  cache.set(cacheKey, result);
  return result;
}
