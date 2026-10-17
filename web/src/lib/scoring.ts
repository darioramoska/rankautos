import { CRITERIA } from "./data";
import type { CarModel, CriterionKey, Listing, Scores, Weights } from "./types";

export const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, Math.round(v * 10) / 10));

export const fmt = (n: number) => n.toLocaleString("de-DE");

export const scoreColor = (s: number) =>
  s >= 8.5 ? "var(--green)" : s >= 7.0 ? "var(--yellow)" : "var(--red)";

// "Charging Speed" only means anything for cars that actually DC fast-charge — scoring it
// for a petrol/diesel/regular-hybrid car would either count as a hard-coded 0 (unfairly
// dragging its average down) or reward it for something it was never going to have. So it's
// left out of the weighted average entirely for those cars, rather than counted as a real 0.
export const chargingApplies = (car: CarModel) => car.fuel === "Electric" || car.fuel === "PHEV";

/**
 * Environmental score — tailpipe emissions, road-tax band and low-emission-zone access.
 *
 * The catalogue carries no per-model CO₂ figures yet (see NEXT_STEPS.md), so this is an
 * ESTIMATE from fuel type, a coarse efficiency proxy and the model year's emission
 * standard — deliberately not presented as an official g/km number. Diesel sits below
 * petrol because city low-emission zones restrict it harder, despite better CO₂.
 * If a stored score ever lands (a score_environmental column), it wins over this.
 */
export function environmentalScore(car: CarModel): number {
  if (typeof car.scores.environmental === "number") return car.scores.environmental;

  let s: number;
  switch (car.fuel) {
    case "Electric":
      s = 9.5;
      break;
    case "PHEV":
      // More electric range means more of the real-world driving is done on battery.
      s = 6.5 + Math.min(1.5, ((car.elec_range_km ?? 0) / 100) * 1.5);
      break;
    case "Hybrid":
      s = 6.5;
      break;
    case "Diesel":
      s = 4.0;
      break;
    default:
      s = 4.5; // Petrol
  }

  if (car.fuel !== "Electric" && car.range_km > 0) {
    // Tank range as a rough economy proxy for combustion drivetrains.
    if (car.range_km >= 900) s += 0.5;
    else if (car.range_km <= 600) s -= 0.5;
  }

  // Newer models meet tighter emission standards.
  if (car.year >= 2023) s += 0.3;
  else if (car.year <= 2018) s -= 0.5;

  return clamp(s, 1, 10);
}

/** Stored score for a criterion, or the derived one where no column exists. */
export const criterionScore = (car: CarModel, key: CriterionKey): number =>
  key === "environmental" ? environmentalScore(car) : car.scores[key] ?? 0;

export function modelWeightedScore(car: CarModel, weights: Weights) {
  const applies = chargingApplies(car);
  let totalW = 0;
  let sum = 0;
  for (const c of CRITERIA) {
    if (c.key === "charging" && !applies) continue;
    const w = weights[c.key] || 0;
    totalW += w;
    sum += criterionScore(car, c.key) * w;
  }
  if (!totalW) return 0;
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
    // Older registrations were built to older emission standards.
    environmental: clamp(environmentalScore(car) - age * 0.08, 1, 10),
    charging: isEV ? clamp(s.charging - age * 0.18, 1, 10) : s.charging,
  };
}

export function listingWeightedScore(car: CarModel, listing: Listing, weights: Weights) {
  const applies = chargingApplies(car);
  const sc = listingScores(car, listing);
  let totalW = 0;
  let sum = 0;
  for (const c of CRITERIA) {
    if (c.key === "charging" && !applies) continue;
    const w = weights[c.key] || 0;
    totalW += w;
    sum += (sc[c.key] || 0) * w;
  }
  if (!totalW) return 0;
  return Math.round((sum / totalW) * 10) / 10;
}

export function bestListing(car: CarModel): Listing {
  if (!car?.listings?.length) {
    return { id: "", name: "", url: "", flag: "", price: 0, year: 0, mileage: 0, condition: "New", location: "", ext_color: "", transmission: "Automatic" };
  }
  return [...car.listings].sort((a, b) => a.price - b.price)[0];
}
