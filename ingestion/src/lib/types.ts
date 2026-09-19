// Shared shapes used across ingestion sources. Field names follow the
// snake_case columns of the `listings` table in database/schema.sql.

export type ListingCondition = "New" | "Used" | "Demo";
export type TransmissionType = "Automatic" | "Manual";

/**
 * A listing normalized into the shape of a row in the `listings` table
 * (minus DB-generated columns like id/first_seen_at/scores, which are
 * either defaulted by Postgres or computed later by a scoring job).
 */
export interface NormalizedListing {
  external_id: string;
  platform_id: string;
  car_model_id: number | null;

  title: string;
  url: string;
  price_eur: number;
  year: number;
  mileage_km: number;
  condition: ListingCondition;
  transmission?: TransmissionType | null;

  country_code?: string | null;
  city?: string | null;
  region?: string | null;

  exterior_color?: string | null;
  interior_color?: string | null;
  doors?: number | null;
  power_kw?: number | null;
  engine_cc?: number | null;

  /** Full source payload, stored for debugging (maps to listings.raw_data). */
  raw_data?: unknown;
}
