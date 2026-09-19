// US used-car listings via the MarketCheck API (licensed aggregator feed of US dealer inventory).
//
// GATED: needs a MarketCheck API key (https://www.marketcheck.com/apis -- paid plans, trial available).
// Until MARKETCHECK_API_KEY is set this exits cleanly and makes no network call. Listing sites like
// Cars.com / CarGurus / Autotrader forbid scraping in their Terms of Service, so a licensed feed is the
// legitimate route. NOTE: written against MarketCheck's public docs and NOT yet run against the live
// API (no key yet) -- verify field names on the first real response.
//
// Prices are USD and mileage is in miles; both are converted here (fixed USD_PER_EUR, override with
// USD_PER_EUR env) and the original values are kept in raw_data. Listings attach to a car_models row
// only when brand + model match one; unmatched vehicles are skipped (the app shows catalog cars only).
import "dotenv/config";
import { getSupabaseClient, isSupabaseConfigured } from "../supabaseClient.js";
import { upsertListing } from "../lib/upsertListing.js";
import type { NormalizedListing } from "../lib/types.js";

const PLATFORM_ID = "autotrader_us"; // MarketCheck aggregates dealer feeds; attribute to the listing's source site when known
const BASE = process.env.MARKETCHECK_API_BASE_URL ?? "https://api.marketcheck.com/v2";
const USD_PER_EUR = Number(process.env.USD_PER_EUR ?? 1.08);
const MI_TO_KM = 1.609344;
const SEARCHES = [
  { make: "Toyota", model: "RAV4" }, { make: "Tesla", model: "Model 3" }, { make: "Ford", model: "Mustang Mach-E" },
  { make: "Hyundai", model: "Ioniq 5" }, { make: "BMW", model: "3 Series" },
];

interface McListing {
  id: string; vin?: string; vdp_url?: string; price?: number; miles?: number;
  build?: { year?: number; make?: string; model?: string; trim?: string; transmission?: string };
  dealer?: { city?: string; state?: string }; exterior_color?: string; source?: string;
}

async function main() {
  const key = process.env.MARKETCHECK_API_KEY;
  if (!key) {
    console.log("[marketcheck] MARKETCHECK_API_KEY not set -- skipping (US listings stay demo data).");
    return;
  }
  if (!isSupabaseConfigured()) { console.log("[marketcheck] Supabase env missing -- nothing to write to."); return; }
  const supabase = getSupabaseClient();
  const { data: cars, error } = await supabase.from("car_models").select("id, display_name, msrp_eur, brands(display_name)");
  if (error || !cars) throw error ?? new Error("could not load car_models");
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  let seen = 0, written = 0, skipped = 0;
  for (const s of SEARCHES) {
    const url = `${BASE}/search/car/active?api_key=${key}&car_type=used&make=${encodeURIComponent(s.make)}&model=${encodeURIComponent(s.model)}&rows=25&sort_by=price&sort_order=asc`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) { console.error(`[marketcheck] ${s.make} ${s.model}: HTTP ${res.status}`); continue; }
    const body = (await res.json()) as { listings?: McListing[] };
    for (const l of body.listings ?? []) {
      seen++;
      const b = l.build;
      if (!l.id || !l.price || !b?.year || !b.make || !b.model) { skipped++; continue; }
      const key2 = norm(`${b.make} ${b.model} ${b.trim ?? ""}`);
      const match = (cars as any[])
        .filter((c) => norm(c.brands?.display_name ?? "") === norm(b.make!) && norm(`${c.brands?.display_name} ${c.display_name}`).split(" ").every((w) => key2.includes(w) || w.length < 3))
        .sort((a, c) => c.display_name.length - a.display_name.length)[0]
        ?? (cars as any[]).find((c) => norm(c.brands?.display_name ?? "") === norm(b.make!) && norm(c.display_name).includes(norm(b.model!)));
      if (!match) { skipped++; continue; }
      const n: NormalizedListing = {
        external_id: `mc:${l.id}`, platform_id: PLATFORM_ID, car_model_id: match.id,
        title: `${b.year} ${b.make} ${b.model} ${b.trim ?? ""}`.trim(),
        url: l.vdp_url ?? "https://www.autotrader.com",
        price_eur: Math.round(l.price / USD_PER_EUR), year: b.year, mileage_km: Math.round((l.miles ?? 0) * MI_TO_KM),
        condition: (l.miles ?? 0) < 500 ? "New" : "Used",
        transmission: /auto/i.test(b.transmission ?? "") ? "Automatic" : /man/i.test(b.transmission ?? "") ? "Manual" : null,
        country_code: "US", city: l.dealer ? `${l.dealer.city}, ${l.dealer.state}` : null, exterior_color: l.exterior_color ?? null,
        raw_data: { source: "marketcheck", currency: "USD", price_usd: l.price, mileage_mi: l.miles, vin: l.vin, site: l.source },
      };
      const r = await upsertListing(supabase, n);
      if (r.error) console.error("[marketcheck]", r.error); else written++;
    }
  }
  console.log(`[marketcheck] seen=${seen} written=${written} skipped=${skipped}`);
}
main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
