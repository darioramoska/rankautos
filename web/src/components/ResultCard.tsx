"use client";

import { useState } from "react";
import type { CarModel } from "@/lib/types";
import { bestListing, fmt } from "@/lib/scoring";
import { useFavorites } from "@/lib/useFavorites";
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
  const [hov, setHov] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(car.id);
  const best = bestListing(car);
  const fuelIcon = FUEL_ICONS[car.fuel];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-3.5 cursor-pointer transition-all duration-150"
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        border: `1.5px solid ${hov ? "var(--grad-2)" : "var(--border)"}`,
        padding: "12px 16px",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "var(--shadow-lg)" : "var(--shadow)",
      }}
    >
      <div className="flex-shrink-0" style={{ width: 30 }}>
        <RankBadge rank={rank} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-bold">
            {car.brand} {car.name}
          </span>
          {car.badge && (
            <span
              className="text-[10px] font-semibold rounded-full uppercase"
              style={{ background: "var(--accent-light)", color: "var(--accent)", padding: "2px 8px", letterSpacing: 0.5 }}
            >
              {car.badge}
            </span>
          )}
        </div>
        <div className="flex gap-3 items-center flex-wrap" style={{ marginTop: 6 }}>
          {fuelIcon && (
            <span className="flex items-center gap-1">
              {fuelIcon("var(--mid)")}
              <span className="text-xs" style={{ color: "var(--mid)" }}>
                {car.fuel}
              </span>
            </span>
          )}
          <span className="text-xs" style={{ color: "var(--mid)" }}>
            {car.type}
          </span>
          <span className="text-xs" style={{ color: "var(--mid)" }}>
            {car.range_km} km
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 7 }}>
          <span className="text-sm font-bold">from €{fmt(best.price)}</span>
          <span
            className="text-[11px] rounded-full"
            style={{ color: "var(--mid)", background: "var(--bg)", padding: "2px 8px", border: "1px solid var(--border)" }}
          >
            {car.listings.length} listings
          </span>
          <span className="text-[11px]" style={{ color: "var(--mid)" }}>
            {best.flag} {best.name}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(car.id);
        }}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
        style={{ width: 30, height: 30 }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill={favorite ? "var(--accent)" : "none"}>
          <path
            d="M10 17.2s-6.6-4-6.6-8.9A3.8 3.8 0 0110 5.9a3.8 3.8 0 016.6 2.4c0 4.9-6.6 8.9-6.6 8.9z"
            stroke={favorite ? "var(--accent)" : "var(--mid)"}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <ScoreBadge score={score} size={56} />
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0 transition-opacity duration-150"
        style={{ opacity: hov ? 1 : 0.2 }}
      >
        <path d="M5 3l4 4-4 4" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
