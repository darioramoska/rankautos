// AutoScout24 Partner API ingestion.
//
// GATED: requires an approved Partner API key. Per integrations/DATA_SOURCES.md
// section 1, getting one is a 2-4 week business process (apply at
// autoscout24.github.io, EU business registration preferred) that the user
// has not started yet. Until AUTOSCOUT24_API_KEY is set, this script logs a
// message and exits 0 -- it never attempts a network call without a key.
//
// Request shape and field mapping below follow DATA_SOURCES.md section 1
// exactly:
//
//   GET /offers
//     ?make=hyundai&model=ioniq5
//     &zip=10115&zipcountry=D&radius=0
//     &fueltype[]=E          (E = Electric)
//     &gear[]=A              (A = Automatic)
//     &pricefrom=20000&priceto=60000
//     &mileageto=100000
//     &firstregistrationyearfrom=2020
//     &sort=price&order=asc
//     &pagesize=20&page=1
//
//   AutoScout24 field              -> RankAutos field
//   id                             -> external_id
//   urls.public_url                -> url
//   prices.public_price.price_amount -> price_eur
//   first_registration_year        -> year
//   mileage.value                  -> mileage_km
//   location.city                  -> city
//   location.country_code          -> country_code
//   exterior_color                 -> exterior_color
//   fuel_type_id                   -> map to fuel_type enum (car_models-level, not stored on listings)
//
// NOTE: DATA_SOURCES.md documents the request path (`GET /offers`) and
// field mapping but not the exact API host or auth header -- those are
// handed out with partner approval. AUTOSCOUT24_API_BASE_URL defaults to a
// placeholder host; confirm the real one from the partner docs once
// approved. Auth defaults to a Bearer token; adjust if the partner docs
// specify a different scheme (e.g. an API-key header).
import "dotenv/config";
import { isSupabaseConfigured, getSupabaseClient } from "../supabaseClient.js";
import { upsertListing } from "../lib/upsertListing.js";
import type { NormalizedListing } from "../lib/types.js";

const PLATFORM_ID = "autoscout24";
const DEFAULT_BASE_URL = "https://api.autoscout24.com";

// A small demo set of searches. Expand/replace once real API access is
// granted and you know which makes/models you want full coverage for --
// ideally driven from `car_models` rather than hardcoded.
const SEARCHES = [
  { make: "volkswagen", model: "id4", fueltype: "E" },
  { make: "hyundai", model: "ioniq5", fueltype: "E" },
];

interface AutoScout24Offer {
  id: string;
  urls?: { public_url?: string };
  prices?: { public_price?: { price_amount?: number } };
  first_registration_year?: number;
  mileage?: { value?: number };
  location?: { city?: string; country_code?: string };
  exterior_color?: string;
  fuel_type_id?: string;
  gear_type_id?: string; // 'A' | 'M' -- not in the table above but needed for `transmission`
}

function buildOffersUrl(baseUrl: string, search: (typeof SEARCHES)[number]): string {
  const params = new URLSearchParams();
  params.set("make", search.make);
  params.set("model", search.model);
  params.append("fueltype[]", search.fueltype);
  params.set("sort", "price");
  params.set("order", "asc");
  params.set("pagesize", "20");
  params.set("page", "1");
  return `${baseUrl}/offers?${params.toString()}`;
}

function normalizeOffer(offer: AutoScout24Offer): NormalizedListing | null {
  const price = offer.prices?.public_price?.price_amount;
  const year = offer.first_registration_year;
  if (!offer.id || price === undefined || year === undefined) return null;

  return {
    external_id: String(offer.id),
    platform_id: PLATFORM_ID,
    car_model_id: null, // TODO: resolve via platform_model_map once that table/lookup exists
    title: `${year} ${offer.exterior_color ? offer.exterior_color + " " : ""}listing #${offer.id}`.trim(),
    url: offer.urls?.public_url ?? `https://www.autoscout24.com/offers/${offer.id}`,
    price_eur: Math.round(price),
    year,
    mileage_km: offer.mileage?.value ?? 0,
    condition: (offer.mileage?.value ?? 0) === 0 ? "New" : "Used",
    transmission: offer.gear_type_id === "A" ? "Automatic" : offer.gear_type_id === "M" ? "Manual" : null,
    country_code: offer.location?.country_code ?? null,
    city: offer.location?.city ?? null,
    exterior_color: offer.exterior_color ?? null,
    raw_data: offer,
  };
}

async function fetchOffers(baseUrl: string, apiKey: string, search: (typeof SEARCHES)[number]): Promise<AutoScout24Offer[]> {
  const url = buildOffersUrl(baseUrl, search);
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      console.error(`[autoscout24] ${search.make}/${search.model}: HTTP ${res.status} -- skipping.`);
      return [];
    }
    const body = (await res.json()) as { offers?: AutoScout24Offer[] } | AutoScout24Offer[];
    return Array.isArray(body) ? body : body.offers ?? [];
  } catch (err) {
    console.error(`[autoscout24] ${search.make}/${search.model}: fetch failed -- ${String(err)}`);
    return [];
  }
}

async function main() {
  const apiKey = process.env.AUTOSCOUT24_API_KEY;
  if (!apiKey) {
    console.log(
      "[autoscout24] AUTOSCOUT24_API_KEY is not set -- AutoScout24 requires an approved Partner API key " +
        "(see integrations/DATA_SOURCES.md section 1). Skipping ingestion; exiting cleanly."
    );
    process.exit(0);
  }

  const baseUrl = process.env.AUTOSCOUT24_API_BASE_URL ?? DEFAULT_BASE_URL;
  const configured = isSupabaseConfigured();
  const supabase = configured ? getSupabaseClient() : null;
  if (!configured) {
    console.log("[autoscout24] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set -- running in DRY RUN mode.");
  }

  let fetched = 0;
  let normalized = 0;
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const search of SEARCHES) {
    const offers = await fetchOffers(baseUrl, apiKey, search);
    fetched += offers.length;

    for (const offer of offers) {
      const listing = normalizeOffer(offer);
      if (!listing) {
        errors++;
        continue;
      }
      normalized++;

      if (!supabase) {
        console.log(`[autoscout24][dry-run] ${listing.external_id} ${listing.title} EUR ${listing.price_eur}`);
        continue;
      }

      const result = await upsertListing(supabase, listing);
      if (result.error) {
        console.error(`[autoscout24] upsert failed for ${result.external_id}: ${result.error}`);
        errors++;
        continue;
      }
      if (result.action === "inserted") inserted++;
      else updated++;
    }
  }

  console.log(
    `[autoscout24] Done. fetched=${fetched} normalized=${normalized} inserted=${inserted} updated=${updated} errors=${errors}`
  );
}

main().catch((err) => {
  console.error("[autoscout24] Unexpected error:", err);
  process.exit(1);
});
