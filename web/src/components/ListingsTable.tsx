"use client";

import { useMemo, useState } from "react";
import type { CarModel, Listing, Weights } from "@/lib/types";
import { fmt, listingWeightedScore } from "@/lib/scoring";
import { ScoreBadge } from "./ScoreBadge";
import { PlatformModal } from "./PlatformModal";

const COLS = "1fr 52px 90px 70px 1fr 82px 44px 24px";

type PlatformSummary = { name: string; url: string; flag: string };
type GroupedRow = { best: Listing & { lScore: number }; count: number; platform: PlatformSummary };

export function ListingsTable({
  car,
  weights,
  platformFilter,
}: {
  car: CarModel;
  weights: Weights;
  platformFilter: string[];
}) {
  const [openPlatform, setOpenPlatform] = useState<PlatformSummary | null>(null);

  const grouped = useMemo<GroupedRow[]>(() => {
    const filtered = car.listings
      .filter((l) => !platformFilter.length || platformFilter.includes(l.name))
      .map((l) => ({ ...l, lScore: listingWeightedScore(car, l, weights) }));
    const map: Record<string, (Listing & { lScore: number })[]> = {};
    filtered.forEach((l) => {
      if (!map[l.name]) map[l.name] = [];
      map[l.name].push(l);
    });
    return Object.values(map)
      .map((group) => ({
        best: [...group].sort((a, b) => b.lScore - a.lScore)[0],
        count: group.length,
        platform: { name: group[0].name, url: group[0].url, flag: group[0].flag },
      }))
      .sort((a, b) => b.best.lScore - a.best.lScore);
  }, [car, weights, platformFilter]);

  if (!grouped.length) {
    return (
      <div className="text-[13px]" style={{ color: "var(--mid)", padding: "12px 0" }}>
        No listings from selected platforms.
      </div>
    );
  }

  return (
    <div>
      <div
        className="text-xs font-semibold uppercase"
        style={{ letterSpacing: 1, color: "var(--mid)", marginBottom: 12 }}
      >
        Live Listings — {car.listings.length} total across {grouped.length} platform{grouped.length !== 1 ? "s" : ""} · click row to
        expand
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: COLS, gap: 12, padding: "6px 14px", fontSize: 10, fontWeight: 600, color: "var(--mid)", textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        <span>Platform</span>
        <span>Year</span>
        <span>Mileage</span>
        <span>Condition</span>
        <span>Location</span>
        <span>Price</span>
        <span>Score</span>
        <span />
      </div>
      <div className="flex flex-col gap-1.5">
        {grouped.map(({ best: l, count, platform }, i) => (
          <div
            key={l.id}
            onClick={() => setOpenPlatform(platform)}
            className={`grid items-center cursor-pointer transition-opacity duration-150 hover:opacity-85 ${i === 0 ? "gradient-brand" : ""}`}
            style={{
              gridTemplateColumns: COLS,
              gap: 12,
              padding: "10px 14px",
              background: i === 0 ? undefined : "var(--bg)",
              border: `1px solid ${i === 0 ? "transparent" : "var(--border)"}`,
              borderRadius: 10,
            }}
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              {i === 0 && (
                <span
                  className="text-[9px] font-bold rounded-full flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.25)", color: "#fff", padding: "1px 5px" }}
                >
                  Best
                </span>
              )}
              <span
                className="text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ color: i === 0 ? "#fff" : "var(--ink)" }}
              >
                {l.flag} {l.name}
              </span>
              {count > 1 && (
                <span
                  className="text-[10px] rounded-full flex-shrink-0"
                  style={{
                    background: i === 0 ? "rgba(255,255,255,0.2)" : "var(--border)",
                    color: i === 0 ? "rgba(255,255,255,0.85)" : "var(--mid)",
                    padding: "1px 6px",
                  }}
                >
                  {count}
                </span>
              )}
            </div>
            <span className="text-xs" style={{ color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--mid)" }}>
              {l.year}
            </span>
            <span className="text-xs" style={{ color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--mid)" }}>
              {l.mileage === 0 ? "New" : `${fmt(l.mileage)} km`}
            </span>
            <span className="text-xs" style={{ color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--mid)" }}>
              {l.condition}
            </span>
            <span
              className="text-xs overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--mid)" }}
            >
              {l.location}
            </span>
            <span className="text-[13px] font-bold whitespace-nowrap" style={{ color: i === 0 ? "#fff" : "var(--ink)" }}>
              €{fmt(l.price)}
            </span>
            <ScoreBadge score={l.lScore} size={40} />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
              <path
                d="M2 4l4 4 4-4"
                stroke={i === 0 ? "#fff" : "var(--ink)"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>
      <div className="text-[11px]" style={{ marginTop: 8, color: "var(--mid)" }}>
        ↻ Refreshed daily · Scores adjust for year &amp; mileage · Click a row to see all listings from that platform
      </div>
      {openPlatform && (
        <PlatformModal car={car} platform={openPlatform} weights={weights} onClose={() => setOpenPlatform(null)} />
      )}
    </div>
  );
}
