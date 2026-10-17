"use client";

import type { CarModel } from "@/lib/types";
import { bestListing, fmt } from "@/lib/scoring";
import { useFavorites } from "@/lib/useFavorites";
import { CarImage } from "./CarImage";
import { ScoreBadge } from "./ScoreBadge";
import { RankBadge } from "./RankBadge";
import { FUEL_ICONS } from "./icons";

export function ResultCard({
  car,
  rank,
  score,
  onClick,
}: {
  car: CarModel;
  rank: number;
  score: number;
  onClick: () => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(car.id);
  const best = bestListing(car);
  const fuelIcon = FUEL_ICONS[car.fuel];

  return (
    <div
      onClick={onClick}
      data-podium={rank <= 3}
      className="result-card flex items-center gap-3 sm:gap-4 cursor-pointer"
      style={{ padding: 12 }}
    >
      <div className="relative flex-shrink-0">
        <CarImage car={car} w={112} h={76} className="car-thumb" />
        <div className="absolute" style={{ top: -8, left: -8 }}>
          <RankBadge rank={rank} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--mid)", letterSpacing: 1.2 }}>
          {car.brand}
        </div>
        <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 1 }}>
          <span className="text-[15px] font-bold truncate" style={{ letterSpacing: "-0.2px" }}>
            {car.name}
          </span>
          {car.badge && (
            <span
              className="text-[9px] font-bold rounded-full uppercase gradient-brand"
              style={{ color: "#fff", padding: "2px 8px", letterSpacing: 0.6 }}
            >
              {car.badge}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 items-center flex-wrap" style={{ marginTop: 7 }}>
          <span className="spec-pill">
            {fuelIcon && fuelIcon("var(--mid)")}
            {car.fuel}
          </span>
          <span className="spec-pill hidden sm:inline-flex">{car.type}</span>
          <span className="spec-pill hidden sm:inline-flex">{car.range_km} km</span>
        </div>
        <div className="flex items-baseline gap-2 flex-wrap" style={{ marginTop: 8 }}>
          <span className="text-[11px]" style={{ color: "var(--mid)" }}>
            from
          </span>
          <span className="text-[17px] font-extrabold" style={{ letterSpacing: "-0.3px" }}>
            €{fmt(best.price)}
          </span>
          <span className="text-[11px]" style={{ color: "var(--mid)" }}>
            {car.listings.length} listings<span className="hidden sm:inline"> · {best.flag} {best.name}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <ScoreBadge score={score} size={54} />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(car.id);
          }}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="flex items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
          style={{ width: 28, height: 28 }}
        >
          <svg width="17" height="17" viewBox="0 0 20 20" fill={favorite ? "var(--accent)" : "none"}>
            <path
              d="M10 17.2s-6.6-4-6.6-8.9A3.8 3.8 0 0110 5.9a3.8 3.8 0 016.6 2.4c0 4.9-6.6 8.9-6.6 8.9z"
              stroke={favorite ? "var(--accent)" : "var(--mid)"}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
