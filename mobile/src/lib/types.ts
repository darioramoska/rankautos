export type Fuel = "Electric" | "Hybrid" | "PHEV" | "Petrol" | "Diesel";
export type BodyType = "SUV" | "Crossover" | "Hatchback" | "Sedan" | "Estate";
export type Transmission = "Automatic" | "Manual";
export type Condition = "New" | "Used";

export interface Criterion {
  key: CriterionKey;
  label: string;
  desc: string;
}

export type CriterionKey =
  | "range"
  | "safety"
  | "practicality"
  | "tech"
  | "reliability"
  | "value"
  | "charging";

export type Scores = Record<CriterionKey, number>;
export type Weights = Record<CriterionKey, number>;

export interface Platform {
  id: string;
  label: string;
  flag: string;
  url: string;
}

export interface Listing {
  id: string;
  name: string;
  url: string;
  flag: string;
  country?: string;
  price: number;
  year: number;
  mileage: number;
  condition: Condition;
  location: string;
  ext_color: string;
  transmission: Transmission;
}

export interface CarModel {
  id: number;
  name: string;
  brand: string;
  type: BodyType;
  fuel: Fuel;
  wikiQuery: string;
  msrp: number;
  seats: number;
  range_km: number;
  elec_range_km?: number;
  boot_l: number;
  charge_kw: number;
  ncap: number;
  year: number;
  color: string;
  badge?: string;
  transmission: Transmission;
  scores: Scores;
  listings: Listing[];
}

export interface Filters {
  manufacturer: string;
  fuel: string[];
  type: string[];
  budgetMin: number;
  budgetMax: number;
  seats: number;
  yearMin: number;
  platforms: string[];
  countries: string[];
  minRange: number;
  transmission: string[];
  colors: string[];
  minBoot: number;
  maxBoot: number;
}
