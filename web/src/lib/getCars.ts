import { CAR_DATA } from "./data";
import { supabase } from "./supabaseClient";
import type { CarModel, Listing } from "./types";

// Shape returned by the Supabase query below (snake_case, nested per
// database/schema.sql's brands/listings/platforms foreign keys).
interface DbListing {
  id: string;
  url: string;
  price_eur: number;
  year: number;
  mileage_km: number;
  condition: string;
  transmission: string;
  exterior_color: string | null;
  city: string | null;
  is_active: boolean;
  platforms: { display_name: string; flag_emoji: string | null; country_code: string | null } | null;
}

interface DbCarModel {
  id: number;
  display_name: string;
  body_type: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  msrp_eur: number | null;
  range_km: number | null;
  electric_range_km: number | null;
  boot_litres: number | null;
  charge_kw: number | null;
  ncap_stars: number | null;
  model_year: number | null;
  brand_color: string | null;
  badge_label: string | null;
  wikipedia_query: string | null;
  score_range: number | null;
  score_safety: number | null;
  score_practicality: number | null;
  score_tech: number | null;
  score_reliability: number | null;
  score_value: number | null;
  score_charging: number | null;
  brands: { display_name: string } | null;
  listings: DbListing[] | null;
}

const CAR_MODEL_SELECT = `
  id, display_name, body_type, fuel_type, transmission, seats,
  msrp_eur, range_km, electric_range_km, boot_litres, charge_kw, ncap_stars, model_year,
  brand_color, badge_label, wikipedia_query,
  score_range, score_safety, score_practicality, score_tech, score_reliability, score_value, score_charging,
  brands ( display_name ),
  listings ( id, url, price_eur, year, mileage_km, condition, transmission, exterior_color, city, is_active,
    platforms ( display_name, flag_emoji, country_code ) )
`;

function mapListing(l: DbListing): Listing {
  return {
    id: l.id,
    name: l.platforms?.display_name ?? "Unknown",
    flag: l.platforms?.flag_emoji ?? "",
    country: l.platforms?.country_code ?? undefined,
    url: l.url,
    price: l.price_eur,
    year: l.year,
    mileage: l.mileage_km,
    condition: l.condition as Listing["condition"],
    location: l.city ?? "",
    ext_color: l.exterior_color ?? "",
    transmission: l.transmission as Listing["transmission"],
  };
}

function mapCarModel(row: DbCarModel): CarModel | null {
  // A model with no active listings can't show a price — skip it rather
  // than rendering a broken card, same as the mock data always having listings.
  const listings = (row.listings ?? []).filter((l) => l.is_active).map(mapListing);
  if (!listings.length) return null;

  return {
    id: row.id,
    name: row.display_name,
    brand: row.brands?.display_name ?? "",
    type: row.body_type as CarModel["type"],
    fuel: row.fuel_type as CarModel["fuel"],
    wikiQuery: row.wikipedia_query ?? `${row.brands?.display_name ?? ""} ${row.display_name}`,
    msrp: row.msrp_eur ?? 0,
    seats: row.seats,
    range_km: row.range_km ?? 0,
    elec_range_km: row.electric_range_km ?? undefined,
    boot_l: row.boot_litres ?? 0,
    charge_kw: row.charge_kw ?? 0,
    ncap: row.ncap_stars ?? 0,
    year: row.model_year ?? new Date().getFullYear(),
    color: row.brand_color ?? "#888",
    badge: row.badge_label ?? undefined,
    transmission: row.transmission as CarModel["transmission"],
    scores: {
      range: row.score_range ?? 0,
      safety: row.score_safety ?? 0,
      practicality: row.score_practicality ?? 0,
      tech: row.score_tech ?? 0,
      reliability: row.score_reliability ?? 0,
      value: row.score_value ?? 0,
      charging: row.score_charging ?? 0,
    },
    listings,
  };
}

/**
 * Live car+listing data from Supabase when configured, falling back to the
 * bundled mock dataset (lib/data.ts) otherwise — including on any query
 * error, so a misconfigured or unreachable database degrades gracefully
 * instead of breaking the app.
 */
export async function getCars(): Promise<CarModel[]> {
  if (!supabase) return CAR_DATA;

  try {
    const { data, error } = await supabase
      .from("car_models")
      .select(CAR_MODEL_SELECT)
      .eq("is_active", true)
      .returns<DbCarModel[]>();

    if (error || !data) throw error ?? new Error("no data");

    const mapped = data.map(mapCarModel).filter((c): c is CarModel => c !== null);
    return mapped.length ? mapped : CAR_DATA;
  } catch {
    return CAR_DATA;
  }
}
