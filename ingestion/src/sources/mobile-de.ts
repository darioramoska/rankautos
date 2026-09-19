// mobile.de Data Feed API ingestion.
//
// GATED: requires an approved partner/data-feed agreement. Per
// integrations/DATA_SOURCES.md section 2, this means contacting
// partner@mobile.de, a German/EU business registration, and typically a
// revenue-share or flat-fee commercial agreement -- a process the user has
// not started. Until MOBILE_DE_API_KEY is set, this script logs a message
// and exits 0 -- it never attempts a network call without a key.
//
// DATA_SOURCES.md notes for mobile.de (section 2):
//   - Owned by the same group as AutoScout24 (Axel Springer / OLX Group) --
//     if an AutoScout24 partnership already exists, mobile.de may offer a
//     combined deal.
//   - Feed supports XML and JSON formats; this script requests JSON.
//   - "Search parameters similar to AutoScout24."
//
// Because DATA_SOURCES.md doesn't give mobile.de its own field-mapping
// table (unlike AutoScout24's explicit one), this script reuses the same
// RankAutos-field mapping convention as AutoScout24 (id/price/mileage/
// location/etc.) as a documented best guess -- confirm and adjust field
// names against the real Data Feed API docs once partner access is
// granted.
import "dotenv/config";
import { isSupabaseConfigured, getSupabaseClient } from "../supabaseClient.js";
import { upsertListing } from "../lib/upsertListing.js";
import type { NormalizedListing } from "../lib/types.js";

const PLATFORM_ID = "mobile_de";
const DEFAULT_BASE_URL = "https://services.mobile.de/data-feed";

// A small demo set of searches -- see the equivalent note in autoscout24.ts.
const SEARCHES = [
  { make: "volkswagen", model: "id4" },
  { make: "bmw", model: "ix3" },
];

interface MobileDeListing {
  id: string;
  url?: string;
  price?: { amount?: number; currency?: string };
  firstRegistrationYear?: number;
  mileage?: number;
  city?: string;
  countryCode?: string;
  exteriorColor?: string;
  gearType?: "AUTOMATIC" | "MANUAL";
}

function buildFeedUrl(baseUrl: string, search: (typeof SEARCHES)[number]): string {
  const params = new URLSearchParams({
    make: search.make,
    model: search.model,
    format: "json",
    sort: "price",
    order: "asc",
    pagesize: "20",
    page: "1",
  });
  return `${baseUrl}/listings?${params.toString()}`;
}

function normalizeListing(item: MobileDeListing): NormalizedListing | null {
  const price = item.price?.amount;
  const year = item.firstRegistrationYear;
  if (!item.id || price === undefined || year === undefined) return null;

  return {
    external_id: String(item.id),
    platform_id: PLATFORM_ID,
    car_model_id: null, // TODO: resolve via platform_model_map once that table/lookup exists
    title: `${year} listing #${item.id}`,
    url: item.url ?? `https://www.mobile.de/listing/${item.id}`,
    price_eur: Math.round(price),
    year,
    mileage_km: item.mileage ?? 0,
    condition: (item.mileage ?? 0) === 0 ? "New" : "Used",
    transmission: item.gearType === "AUTOMATIC" ? "Automatic" : item.gearType === "MANUAL" ? "Manual" : null,
    country_code: item.countryCode ?? "DE",
    city: item.city ?? null,
    exterior_color: item.exteriorColor ?? null,
    raw_data: item,
  };
}

async function fetchListings(baseUrl: string, apiKey: string, search: (typeof SEARCHES)[number]): Promise<MobileDeListing[]> {
  const url = buildFeedUrl(baseUrl, search);
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      console.error(`[mobile-de] ${search.make}/${search.model}: HTTP ${res.status} -- skipping.`);
      return [];
    }
    const body = (await res.json()) as { listings?: MobileDeListing[] } | MobileDeListing[];
    return Array.isArray(body) ? body : body.listings ?? [];
  } catch (err) {
    console.error(`[mobile-de] ${search.make}/${search.model}: fetch failed -- ${String(err)}`);
    return [];
  }
}

async function main() {
  const apiKey = process.env.MOBILE_DE_API_KEY;
  if (!apiKey) {
    console.log(
      "[mobile-de] MOBILE_DE_API_KEY is not set -- mobile.de requires an approved Data Feed API agreement " +
        "(see integrations/DATA_SOURCES.md section 2). Skipping ingestion; exiting cleanly."
    );
    process.exit(0);
  }

  const baseUrl = process.env.MOBILE_DE_API_BASE_URL ?? DEFAULT_BASE_URL;
  const configured = isSupabaseConfigured();
  const supabase = configured ? getSupabaseClient() : null;
  if (!configured) {
    console.log("[mobile-de] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set -- running in DRY RUN mode.");
  }

  let fetched = 0;
  let normalized = 0;
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const search of SEARCHES) {
    const listings = await fetchListings(baseUrl, apiKey, search);
    fetched += listings.length;

    for (const item of listings) {
      const listing = normalizeListing(item);
      if (!listing) {
        errors++;
        continue;
      }
      normalized++;

      if (!supabase) {
        console.log(`[mobile-de][dry-run] ${listing.external_id} ${listing.title} EUR ${listing.price_eur}`);
        continue;
      }

      const result = await upsertListing(supabase, listing);
      if (result.error) {
        console.error(`[mobile-de] upsert failed for ${result.external_id}: ${result.error}`);
        errors++;
        continue;
      }
      if (result.action === "inserted") inserted++;
      else updated++;
    }
  }

  console.log(
    `[mobile-de] Done. fetched=${fetched} normalized=${normalized} inserted=${inserted} updated=${updated} errors=${errors}`
  );
}

main().catch((err) => {
  console.error("[mobile-de] Unexpected error:", err);
  process.exit(1);
});
