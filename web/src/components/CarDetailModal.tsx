"use client";

import { useEffect, useState } from "react";
import { CRITERIA } from "@/lib/data";
import { bestListing, chargingApplies, criterionScore, fmt, scoreColor } from "@/lib/scoring";
import type { CarModel, Weights } from "@/lib/types";
import { CarShowroom } from "./CarShowroom";
import { ScoreBadge } from "./ScoreBadge";
import { FUEL_ICONS } from "./icons";
import { ListingsTable } from "./ListingsTable";

export function CarDetailModal({
  car,
  score,
  weights,
  platformFilter,
  onClose,
}: {
  car: CarModel;
  score: number;
  weights: Weights;
  platformFilter: string[];
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const fuelIcon = FUEL_ICONS[car.fuel];
  const best = bestListing(car);

  const stats = (
    car.fuel === "Hybrid" && car.elec_range_km
      ? [
          { l: "EV Range", v: `~${car.elec_range_km} km`, i: "bolt", c: TINT.blue },
          { l: "Fuel Range", v: `~${car.range_km - car.elec_range_km} km`, i: "range", c: TINT.blue },
        ]
      : [{ l: "Range", v: `${car.range_km} km`, i: "range", c: TINT.blue }]
  ).concat([
    { l: "Boot", v: `${car.boot_l} L`, i: "boot", c: TINT.coral },
    { l: "Seats", v: String(car.seats), i: "seats", c: TINT.violet },
    { l: "NCAP", v: "★".repeat(car.ncap), i: "shield", c: TINT.green },
    {
      l: car.charge_kw > 0 ? "DC Peak" : "Charging",
      v: car.charge_kw > 0 ? `${car.charge_kw} kW` : "N/A",
      i: "bolt",
      c: TINT.amber,
    },
    { l: "Gearbox", v: car.transmission || "Auto", i: "gear", c: TINT.pink },
  ]);

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 100, background: "rgba(20,8,48,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full overflow-auto max-w-[760px] lg:max-w-[980px]"
        style={{
          background: "var(--surface)",
          borderRadius: "28px 28px 0 0",
          maxHeight: "92vh",
          padding: "28px 28px 40px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="flex justify-between items-start" style={{ marginBottom: 20 }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              {fuelIcon && fuelIcon("var(--mid)")}
              <span
                className="text-xs font-semibold uppercase"
                style={{ color: "var(--mid)", letterSpacing: 0.5 }}
              >
                {car.fuel} · {car.type} · {car.year}
              </span>
            </div>
            <h2 className="text-[22px] font-extrabold" style={{ letterSpacing: "-0.5px" }}>
              {car.brand} {car.name}
            </h2>
            <div className="text-[13px]" style={{ color: "var(--mid)", marginTop: 4 }}>
              From <strong style={{ color: "var(--ink)", fontSize: 18 }}>€{fmt(best.price)}</strong>
              <span style={{ marginLeft: 8 }}>· MSRP €{fmt(car.msrp)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={score} size={70} />
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full"
              style={{ width: 34, height: 34, background: "var(--bg)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] lg:gap-8" style={{ marginBottom: 28 }}>
          <div>
            <CarShowroom car={car} />

            <div className="grid grid-cols-2" style={{ gap: 8 }}>
              {stats.map((s) => (
                <div key={s.l} className="stat-tile">
                  <div className="stat-icon" style={{ background: `color-mix(in srgb, ${s.c} 14%, transparent)` }}>
                    <StatIcon kind={s.i} color={s.c} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold truncate" style={{ color: s.l === "NCAP" ? s.c : "var(--ink)" }}>
                      {s.v}
                    </div>
                    <div className="text-[10px] uppercase" style={{ color: "var(--mid)", letterSpacing: 0.5 }}>
                      {s.l}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 lg:mt-0">
            <div
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: 1, color: "var(--mid)", marginBottom: 12 }}
            >
              Score Breakdown ({car.year} model)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 10 }}>
              {CRITERIA.map((c) => {
                if (c.key === "charging" && !chargingApplies(car)) {
                  return (
                    <div key={c.key} className="gauge-card gauge-card--off">
                      <Gauge value={null} />
                      <div className="text-[12px] font-semibold" style={{ color: "var(--mid)", marginTop: 8 }}>
                        {c.label}
                      </div>
                      <div className="text-[10px]" style={{ color: "var(--mid)", marginTop: 2 }}>
                        Electric / plug-in only
                      </div>
                    </div>
                  );
                }
                const raw = criterionScore(car, c.key);
                const w = weights[c.key] || 0;
                return (
                  <div key={c.key} className="gauge-card" title={c.desc}>
                    <Gauge value={raw} />
                    <div className="text-[12px] font-semibold leading-tight" style={{ marginTop: 8 }}>
                      {c.label}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--mid)", marginTop: 2 }}>
                      {w === 0 ? "not weighted" : scoreWord(raw)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <ListingsTable car={car} weights={weights} platformFilter={platformFilter} />
      </div>
    </div>
  );
}

const TINT = {
  blue: "oklch(0.6 0.17 255)",
  coral: "oklch(0.68 0.18 30)",
  violet: "#7c3aed",
  green: "oklch(0.62 0.16 150)",
  amber: "oklch(0.72 0.16 70)",
  pink: "#c026d3",
};

const scoreWord = (s: number) => (s >= 8.5 ? "Excellent" : s >= 7 ? "Good" : s >= 5.5 ? "Average" : "Weak");

// Ring gauge that sweeps in from zero when the modal opens. null = not applicable.
function Gauge({ value }: { value: number | null }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value ?? 0));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const size = 64;
  const r = 26;
  const circ = 2 * Math.PI * r;
  const col = value == null ? "var(--border)" : scoreColor(value);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={32} cy={32} r={r} fill="none" stroke="var(--border)" strokeWidth={7} strokeDasharray={value == null ? "3 5" : undefined} />
        {value != null && (
          <circle
            className="gauge-arc"
            cx={32}
            cy={32}
            r={r}
            fill="none"
            stroke={col}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={`${(shown / 10) * circ} ${circ}`}
          />
        )}
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-extrabold"
        style={{ fontSize: 15, color: value == null ? "var(--mid)" : "var(--ink)" }}
      >
        {value == null ? "—" : value.toFixed(1)}
      </span>
    </div>
  );
}

function StatIcon({ kind, color }: { kind: string; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      {kind === "range" && (
        <>
          <path {...p} d="M4 18a8 8 0 1 1 16 0" />
          <path {...p} d="M12 18l4-6" />
        </>
      )}
      {kind === "bolt" && <path {...p} d="M13 2L4 14h7l-1 8 9-12h-7z" />}
      {kind === "boot" && (
        <>
          <rect {...p} x="3" y="7" width="18" height="13" rx="2" />
          <path {...p} d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </>
      )}
      {kind === "seats" && (
        <>
          <circle {...p} cx="12" cy="8" r="4" />
          <path {...p} d="M4 21a8 8 0 0 1 16 0" />
        </>
      )}
      {kind === "shield" && (
        <>
          <path {...p} d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          <path {...p} d="M9 12l2 2 4-4" />
        </>
      )}
      {kind === "gear" && (
        <>
          <path {...p} d="M6 4v16M12 4v16M18 4v8" />
          <path {...p} d="M6 12h12" />
        </>
      )}
    </svg>
  );
}
