"use client";

import { useEffect } from "react";
import { CRITERIA } from "@/lib/data";
import { bestListing, fmt, scoreColor } from "@/lib/scoring";
import type { CarModel, Weights } from "@/lib/types";
import { CarImage } from "./CarImage";
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
          { l: "EV Range", v: `~${car.elec_range_km} km` },
          { l: "Fuel Range", v: `~${car.range_km - car.elec_range_km} km` },
        ]
      : [{ l: "Range", v: `${car.range_km} km` }]
  ).concat([
    { l: "Boot", v: `${car.boot_l} L` },
    { l: "Seats", v: String(car.seats) },
    { l: "NCAP", v: "★".repeat(car.ncap) },
    { l: car.charge_kw > 0 ? "DC Peak" : "Charging", v: car.charge_kw > 0 ? `${car.charge_kw} kW` : "N/A" },
    { l: "Gearbox", v: car.transmission || "Auto" },
  ]);

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 100, background: "rgba(20,8,48,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full overflow-auto"
        style={{
          background: "var(--surface)",
          borderRadius: "28px 28px 0 0",
          maxWidth: 760,
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

        <div
          className="rounded-2xl flex justify-center"
          style={{ background: "var(--bg)", padding: 20, marginBottom: 20 }}
        >
          <CarImage car={car} w={260} h={146} />
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 10, marginBottom: 24 }}
        >
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl text-center" style={{ background: "var(--bg)", padding: "10px 12px" }}>
              <div className="text-base font-bold">{s.v}</div>
              <div className="text-[10px] uppercase" style={{ color: "var(--mid)", marginTop: 2, letterSpacing: 0.5 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div
            className="text-xs font-semibold uppercase"
            style={{ letterSpacing: 1, color: "var(--mid)", marginBottom: 12 }}
          >
            Score Breakdown ({car.year} model)
          </div>
          <div className="flex flex-col gap-2.5">
            {CRITERIA.map((c) => {
              const raw = car.scores[c.key] || 0;
              const w = weights[c.key] || 0;
              const col = scoreColor(raw);
              return (
                <div key={c.key}>
                  <div className="flex justify-between" style={{ marginBottom: 4 }}>
                    <span className="text-[13px] font-medium">{c.label}</span>
                    <div className="flex items-center gap-2">
                      {w === 0 && (
                        <span
                          className="text-[10px] rounded-full"
                          style={{ color: "var(--mid)", background: "var(--bg)", padding: "1px 7px" }}
                        >
                          not weighted
                        </span>
                      )}
                      <span className="text-[13px] font-bold" style={{ color: col }}>
                        {raw.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 5, background: "var(--border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${raw * 10}%`, background: col }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ListingsTable car={car} weights={weights} platformFilter={platformFilter} />
      </div>
    </div>
  );
}
