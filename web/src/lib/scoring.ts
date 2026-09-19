import { CRITERIA } from "./data";
import type { CarModel, Listing, Scores, Weights } from "./types";

export const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, Math.round(v * 10) / 10));

export const fmt = (n: number) => n.toLocaleString("de-DE");

export const scoreColor = (s: number) =>
  s >= 8.5 ? "var(--green)" : s >= 7.0 ? "var(--yellow)" : "var(--red)";

export function modelWeightedScore(car: CarModel, weights: Weights) {
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
  if (!totalW) return 0;
  const sum = CRITERIA.reduce(
    (acc, c) => acc + (car.scores[c.key] || 0) * (weights[c.key] || 0),
    0,
  );
  return Math.round((sum / totalW) * 10) / 10;
}

// Year + mileage adjusted scores per listing
export function listingScores(car: CarModel, listing: Listing): Scores {
  const age = 2025 - listing.year;
  const km = listing.mileage / 10000;
  const isEV = car.fuel === "Electric" || car.fuel === "PHEV";
  const s = car.scores;
  return {
    range: clamp(s.range - (isEV ? age * 0.14 + km * 0.02 : age * 0.04), 1, 10),
    safety: clamp(s.safety - age * 0.18, 1, 10),
    practicality: clamp(s.practicality - age * 0.04 - km * 0.01, 1, 10),
    tech: clamp(s.tech - age * 0.28, 1, 10),
    reliability: clamp(s.reliability - km * 0.04, 1, 10),
    value: clamp(s.value + age * 0.22 - km * 0.02, 1, 10),
    charging: isEV ? clamp(s.charging - age * 0.18, 1, 10) : s.charging,
  };
}

export function listingWeightedScore(car: CarModel, listing: Listing, weights: Weights) {
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
  if (!totalW) return 0;
  const sc = listingScores(car, listing);
  const sum = CRITERIA.reduce(
    (acc, c) => acc + (sc[c.key] || 0) * (weights[c.key] || 0),
    0,
  );
  return Math.round((sum / totalW) * 10) / 10;
}

export function bestListing(car: CarModel): Listing {
  if (!car?.listings?.length) {
    return { id: "", name: "", url: "", flag: "", price: 0, year: 0, mileage: 0, condition: "New", location: "", ext_color: "", transmission: "Automatic" };
  }
  return [...car.listings].sort((a, b) => a.price - b.price)[0];
}
