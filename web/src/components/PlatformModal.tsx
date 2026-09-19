"use client";

import { useEffect, useMemo, useState } from "react";
import type { CarModel, Weights } from "@/lib/types";
import { fmt, listingWeightedScore } from "@/lib/scoring";
import { ScoreBadge } from "./ScoreBadge";

const COLOR_HEX: Record<string, string> = {
  White: "#f0f0f0",
  Black: "#1a1a1a",
  Silver: "#c8c8c8",
  Grey: "#808080",
  Blue: "#2155a3",
  Red: "#cc2200",
  Green: "#2e7d32",
  Brown: "#795548",
};

const COLS = "1fr 52px 90px 70px 1fr 82px 44px";
const PER_PAGE = 10;

export function PlatformModal({
  car,
  platform,
  weights,
  onClose,
}: {
  car: CarModel;
  platform: { name: string; url: string; flag: string };
  weights: Weights;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [condFilter, setCondFilter] = useState<"All" | "New" | "Used">("All");
  const [maxKm, setMaxKm] = useState(200000);
  const [minYear, setMinYear] = useState(2015);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const allListings = useMemo(() => {
    return car.listings
      .filter((l) => l.name === platform.name)
      .filter((l) => condFilter === "All" || l.condition === condFilter)
      .filter((l) => l.mileage <= maxKm)
      .filter((l) => l.year >= minYear)
      .map((l) => ({ ...l, lScore: listingWeightedScore(car, l, weights) }))
      .sort((a, b) => b.lScore - a.lScore);
  }, [car, platform, weights, condFilter, maxKm, minYear]);

  const pages = Math.max(1, Math.ceil(allListings.length / PER_PAGE));
  const visible = allListings.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 200, background: "rgba(20,8,48,0.6)", backdropFilter: "blur(4px)", padding: 24 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full flex flex-col overflow-hidden"
        style={{ background: "var(--surface)", borderRadius: 24, maxWidth: 820, maxHeight: "90vh", boxShadow: "var(--shadow-lg)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{ padding: "20px 24px 14px", borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <div className="text-xs" style={{ color: "var(--mid)", marginBottom: 4 }}>
              {platform.flag} {platform.name} · {car.brand} {car.name}
            </div>
            <div className="text-lg font-bold">
              {allListings.length} listing{allListings.length !== 1 ? "s" : ""} found
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "var(--bg)" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 1l11 11M12 1L1 12" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div
          className="flex flex-wrap items-center gap-5 flex-shrink-0"
          style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase" style={{ color: "var(--mid)", letterSpacing: 0.5 }}>
              Condition:
            </span>
            {(["All", "New", "Used"] as const).map((c) => {
              const active = condFilter === c;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setCondFilter(c);
                    setPage(0);
                  }}
                  className={`text-xs font-semibold rounded-full transition-all duration-150 ${active ? "gradient-brand" : ""}`}
                  style={{
                    padding: "4px 10px",
                    background: active ? undefined : "var(--surface)",
                    color: active ? "#fff" : "var(--mid)",
                    border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: 160 }}>
            <span className="text-[11px] font-semibold uppercase whitespace-nowrap" style={{ color: "var(--mid)", letterSpacing: 0.5 }}>
              Max km: <strong style={{ color: "var(--ink)" }}>{fmt(maxKm)}</strong>
            </span>
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={maxKm}
              onChange={(e) => {
                setMaxKm(+e.target.value);
                setPage(0);
              }}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2" style={{ minWidth: 150 }}>
            <span className="text-[11px] font-semibold uppercase whitespace-nowrap" style={{ color: "var(--mid)", letterSpacing: 0.5 }}>
              From: <strong style={{ color: "var(--ink)" }}>{minYear}</strong>
            </span>
            <input
              type="range"
              min="2015"
              max="2025"
              step="1"
              value={minYear}
              onChange={(e) => {
                setMinYear(+e.target.value);
                setPage(0);
              }}
              className="flex-1"
            />
          </div>
        </div>

        {/* Column headers */}
        <div
          className="grid flex-shrink-0"
          style={{
            gridTemplateColumns: COLS,
            gap: 12,
            padding: "8px 24px",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--mid)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          <span>Platform</span>
          <span>Year</span>
          <span>Mileage</span>
          <span>Condition</span>
          <span>Location</span>
          <span>Price</span>
          <span>Score</span>
        </div>

        {/* Rows */}
        <div className="overflow-y-auto flex-1" style={{ padding: "0 24px 8px" }}>
          {visible.length === 0 ? (
            <div className="text-center" style={{ padding: 40, color: "var(--mid)", fontSize: 14 }}>
              No listings match filters
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {visible.map((l, i) => {
                const isBest = i === 0 && page === 0;
                return (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`grid items-center transition-opacity duration-150 hover:opacity-85 ${isBest ? "gradient-brand" : ""}`}
                    style={{
                      gridTemplateColumns: COLS,
                      gap: 12,
                      padding: "10px 12px",
                      background: isBest ? undefined : "var(--bg)",
                      border: `1px solid ${isBest ? "transparent" : "var(--border)"}`,
                      borderRadius: 10,
                    }}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {isBest && (
                        <span
                          className="text-[9px] font-bold rounded-full flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.25)", color: "#fff", padding: "1px 5px" }}
                        >
                          Best
                        </span>
                      )}
                      <span
                        className="text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ color: isBest ? "#fff" : "var(--ink)" }}
                      >
                        {l.flag} {l.name}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: isBest ? "rgba(255,255,255,0.8)" : "var(--mid)" }}>
                      {l.year}
                    </span>
                    <span className="text-xs" style={{ color: isBest ? "rgba(255,255,255,0.8)" : "var(--mid)" }}>
                      {l.mileage === 0 ? "New" : `${fmt(l.mileage)} km`}
                    </span>
                    <span className="text-xs" style={{ color: isBest ? "rgba(255,255,255,0.8)" : "var(--mid)" }}>
                      {l.condition}
                    </span>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {l.ext_color && (
                        <div
                          title={l.ext_color}
                          className="rounded-full flex-shrink-0"
                          style={{
                            width: 12,
                            height: 12,
                            background: COLOR_HEX[l.ext_color] || "#ccc",
                            border: "1.5px solid rgba(0,0,0,0.15)",
                          }}
                        />
                      )}
                      <span
                        className="text-xs overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ color: isBest ? "rgba(255,255,255,0.8)" : "var(--mid)" }}
                      >
                        {l.location}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold whitespace-nowrap" style={{ color: isBest ? "#fff" : "var(--ink)" }}>
                      €{fmt(l.price)}
                    </span>
                    <ScoreBadge score={l.lScore} size={40} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div
            className="flex items-center justify-center gap-1.5 flex-shrink-0"
            style={{ padding: "12px 24px", borderTop: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`text-[13px] font-semibold rounded-lg ${page === 0 ? "" : "gradient-brand"}`}
              style={{ padding: "5px 14px", background: page === 0 ? "var(--bg)" : undefined, color: page === 0 ? "var(--mid)" : "#fff", opacity: page === 0 ? 0.5 : 1 }}
            >
              ←
            </button>
            {Array.from({ length: pages }, (_, i) => i).map((i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`text-[13px] font-bold rounded-lg ${page === i ? "gradient-brand" : ""}`}
                style={{
                  width: 32,
                  height: 32,
                  background: page === i ? undefined : "var(--bg)",
                  color: page === i ? "#fff" : "var(--mid)",
                  border: `1px solid ${page === i ? "transparent" : "var(--border)"}`,
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page === pages - 1}
              className={`text-[13px] font-semibold rounded-lg ${page === pages - 1 ? "" : "gradient-brand"}`}
              style={{
                padding: "5px 14px",
                background: page === pages - 1 ? "var(--bg)" : undefined,
                color: page === pages - 1 ? "var(--mid)" : "#fff",
                opacity: page === pages - 1 ? 0.5 : 1,
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
