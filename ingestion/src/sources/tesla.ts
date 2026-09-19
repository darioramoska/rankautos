// Tesla.com inventory ingestion.
//
// Hits Tesla's public inventory JSON endpoint (no API key required) --
// documented in integrations/DATA_SOURCES.md section 7:
//
//   GET https://www.tesla.com/inventory/api/v4/inventory-results
//     ?query={"query":{"model":"my","condition":"used","options":{},
//              "arrangeby":"Price","order":"asc","market":"NL",
//              "language":"en","super_region":"north america"},
//             "offset":0,"count":24,"outsideOffset":0,"outsideSearch":false}
//
// NOTE ON VERIFICATION: this endpoint is fronted by Akamai bot protection
// that returns HTTP 403 for requests originating from common cloud/CI IP
// ranges regardless of headers sent (we confirmed this in the sandbox this
// script was authored in -- even tesla.com/robots.txt 403s from that IP).
// The request shape below matches DATA_SOURCES.md exactly, and the
// response normalizer is written from the well-documented public shape of
// this endpoint (VIN/Price/Year/City/... fields), but has NOT been
// exercised against a live 200 response. Run with --dry-run from a normal
// residential/office network first and eyeball the logged rows -- adjust
// FIELD NAMES in `normalizeResult()` below if Tesla's actual response
// shape has drifted. See ingestion/README.md for details.
import "dotenv/config";
import { isSupabaseConfigured, getSupabaseClient } from "../supabaseClient.js";
import { upsertListing } from "../lib/upsertListing.js";
import { findCarModelIdBySlugPattern } from "../lib/carModels.js";
import type { NormalizedListing, ListingCondition } from "../lib/types.js";

const PLATFORM_ID = "tesla";
const BASE_URL = "https://www.tesla.com/inventory/api/v4/inventory-results";

type TeslaModelCode = "my" | "m3";
type TeslaCondition = "new" | "used";

// Small, fixed sweep per the ingestion brief: Model Y + Model 3, NL + DE,
// new + used. Extend this list once the pipeline is proven out.
const MODELS: TeslaModelCode[] = ["my", "m3"];
const MARKETS = ["NL", "DE"];
const CONDITIONS: TeslaCondition[] = ["new", "used"];
const COUNT_PER_REQUEST = 24;

// Maps a Tesla model code to the car_models.slug ILIKE pattern used to
// resolve car_model_id, and to a human-readable model name for titles/logs.
const MODEL_META: Record<TeslaModelCode, { slugPattern: string; name: string }> = {
  my: { slugPattern: "tesla-model-y%", name: "Model Y" },
  m3: { slugPattern: "tesla-model-3%", name: "Model 3" },
};

function buildQueryUrl(model: TeslaModelCode, market: string, condition: TeslaCondition, offset: number): string {
  const query = {
    query: {
      model,
      condition,
      options: {},
      arrangeby: "Price",
      order: "asc",
      market,
      language: "en",
      super_region: "north america",
    },
    offset,
    count: COUNT_PER_REQUEST,
    outsideOffset: 0,
    outsideSearch: false,
  };
  return `${BASE_URL}?query=${encodeURIComponent(JSON.stringify(query))}`;
}

const REQUEST_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.tesla.com/inventory/new/my",
};

/** Reads the first defined value among several possible field name spellings. */
function pick<T = unknown>(obj: Record<string, unknown>, keys: string[]): T | undefined {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key] as T;
  }
  return undefined;
}

function mapCondition(raw: unknown, requested: TeslaCondition): ListingCondition {
  const isDemo = pick<boolean>(raw as Record<string, unknown>, ["IsDemo", "isDemo"]);
  if (isDemo) return "Demo";
  return requested === "new" ? "New" : "Used";
}

function normalizeResult(
  raw: Record<string, unknown>,
  model: TeslaModelCode,
  market: string,
  condition: TeslaCondition,
  carModelId: number | null
): NormalizedListing | null {
  const vin = pick<string>(raw, ["VIN", "Vin", "vin"]);
  if (!vin) return null;

  const price = pick<number>(raw, ["Price", "PurchasePrice", "InventoryPrice", "TotalPrice", "price"]);
  const year = pick<number>(raw, ["Year", "year"]) ?? new Date().getFullYear();
  const odometer = pick<number>(raw, ["OdometerValue", "Odometer", "odometer"]) ?? 0;
  const city = pick<string>(raw, ["City", "city"]);
  const stateProvince = pick<string>(raw, ["StateProvince", "stateProvince"]);
  const trimName = pick<string>(raw, ["TrimName", "TrimNameFormatted", "TrimText"]);
  const paint = pick<string[]>(raw, ["PAINT", "Paint"]);
  const interior = pick<string[]>(raw, ["INTERIOR", "Interior"]);

  if (price === undefined) return null;

  const modelName = MODEL_META[model].name;
  const title = [year, "Tesla", modelName, trimName].filter(Boolean).join(" ");

  return {
    external_id: vin,
    platform_id: PLATFORM_ID,
    car_model_id: carModelId,
    title,
    // Tesla's public API response doesn't include a stable per-vehicle
    // detail URL field; link back to the search results for this
    // model/market/condition as the best available canonical URL.
    url: `https://www.tesla.com/inventory/${condition}/${model}?market=${market}`,
    price_eur: Math.round(price),
    year,
    mileage_km: condition === "new" ? 0 : Math.round(odometer),
    condition: mapCondition(raw, condition),
    transmission: "Automatic",
    country_code: market,
    city: city ?? null,
    region: stateProvince ?? null,
    exterior_color: Array.isArray(paint) ? paint.join(",") : (paint as unknown as string) ?? null,
    interior_color: Array.isArray(interior) ? interior.join(",") : (interior as unknown as string) ?? null,
    raw_data: raw,
  };
}

async function fetchInventory(
  model: TeslaModelCode,
  market: string,
  condition: TeslaCondition
): Promise<Record<string, unknown>[]> {
  const results: Record<string, unknown>[] = [];
  let offset = 0;

  // Cap at a few pages so a single run stays small and fast, per the brief
  // ("a small set of models/markets"). Bump MAX_PAGES if you need more.
  const MAX_PAGES = 3;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = buildQueryUrl(model, market, condition, offset);
    try {
      const res = await fetch(url, { headers: REQUEST_HEADERS });
      if (!res.ok) {
        console.error(
          `[tesla] ${model}/${market}/${condition} offset=${offset}: HTTP ${res.status} -- skipping this page.`
        );
        break;
      }
      const body = (await res.json()) as { results?: Record<string, unknown>[]; total_matches_found?: number };
      const pageResults = body.results ?? [];
      results.push(...pageResults);

      const total = body.total_matches_found ?? pageResults.length;
      offset += COUNT_PER_REQUEST;
      if (pageResults.length === 0 || offset >= total) break;
    } catch (err) {
      console.error(`[tesla] ${model}/${market}/${condition} offset=${offset}: fetch failed -- ${String(err)}`);
      break; // don't crash the whole run on one bad request
    }
  }

  return results;
}

async function main() {
  const dryRunFlag = process.argv.includes("--dry-run");
  const configured = isSupabaseConfigured();
  const dryRun = dryRunFlag || !configured;

  if (!configured) {
    console.log(
      "[tesla] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set -- running in DRY RUN mode " +
        "(fetching + normalizing only, no writes)."
    );
  } else if (dryRunFlag) {
    console.log("[tesla] --dry-run passed -- fetching + normalizing only, no writes.");
  }

  const supabase = configured ? getSupabaseClient() : null;

  let fetched = 0;
  let normalized = 0;
  let inserted = 0;
  let updated = 0;
  let priceChanges = 0;
  let errors = 0;

  for (const model of MODELS) {
    // Resolve car_model_id once per model (cached), not once per listing.
    const carModelId =
      supabase && !dryRun ? await findCarModelIdBySlugPattern(supabase, "tesla", MODEL_META[model].slugPattern) : null;

    if (supabase && !dryRun && carModelId === null) {
      console.log(
        `[tesla] No car_models row matched pattern '${MODEL_META[model].slugPattern}' -- ` +
          `listings for ${MODEL_META[model].name} will be inserted with car_model_id = NULL. ` +
          `Run database/seed_data.sql (or add the model) and re-run to backfill matching.`
      );
    }

    for (const market of MARKETS) {
      for (const condition of CONDITIONS) {
        const raw = await fetchInventory(model, market, condition);
        fetched += raw.length;

        for (const item of raw) {
          const listing = normalizeResult(item, model, market, condition, carModelId);
          if (!listing) {
            errors++;
            continue;
          }
          normalized++;

          if (dryRun || !supabase) {
            console.log(`[tesla][dry-run] ${listing.external_id} ${listing.title} EUR ${listing.price_eur} (${listing.city ?? "?"}, ${listing.country_code})`);
            continue;
          }

          const result = await upsertListing(supabase, listing);
          if (result.error) {
            console.error(`[tesla] upsert failed for ${result.external_id}: ${result.error}`);
            errors++;
            continue;
          }
          if (result.action === "inserted") inserted++;
          else updated++;
          if (result.priceChanged) priceChanges++;
        }
      }
    }
  }

  console.log(
    `[tesla] Done. fetched=${fetched} normalized=${normalized} inserted=${inserted} updated=${updated} ` +
      `price_history_rows=${priceChanges} errors=${errors} dryRun=${dryRun}`
  );
}

main().catch((err) => {
  console.error("[tesla] Unexpected error:", err);
  process.exit(1);
});
