"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CRITERIA } from "@/lib/data";
import { bestListing, modelWeightedScore } from "@/lib/scoring";
import { useWeights } from "@/lib/useWeights";
import { useFilters } from "@/lib/useFilters";
import type { CarModel } from "@/lib/types";
import { WeightSlider } from "./WeightSlider";
import { ResultCard } from "./ResultCard";
import { CarDetailModal } from "./CarDetailModal";

type SortBy = "score" | "price";

export function ResultsScreen({ cars }: { cars: CarModel[] }) {
  const { weights, setWeights, reset } = useWeights();
  const { filters } = useFilters();
  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  useEffect(() => {
    const id = Number(new URLSearchParams(window.location.search).get("car"));
    if (id) setSelectedCarId(id);
  }, []);

  const platformFilter = filters.platforms;

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      if (filters.manufacturer && car.brand !== filters.manufacturer) return false;
      if (filters.fuel.length && !filters.fuel.includes(car.fuel)) return false;
      if (filters.type.length && !filters.type.includes(car.type)) return false;
      if (car.seats < filters.seats) return false;
      if ((filters.minBoot || 0) > 0 && car.boot_l < filters.minBoot) return false;
      if ((filters.maxBoot || 1200) < 1200 && car.boot_l > filters.maxBoot) return false;
      const cheapest = bestListing(car).price;
      // budgetMax at the slider's top position (80000) means "€80,000+" / uncapped —
      // the BudgetRange UI already labels it that way, the filter needs to match.
      if (filters.budgetMax < 80000 && cheapest > filters.budgetMax) return false;
      if (filters.budgetMin > 0 && cheapest < filters.budgetMin) return false;
      if ((filters.minRange || 0) > 0 && car.range_km < filters.minRange) return false;
      if ((filters.transmission || []).length && !filters.transmission.includes(car.transmission)) return false;
      if (platformFilter.length && !car.listings.some((l) => platformFilter.includes(l.name))) return false;
      return true;
    });
  }, [cars, filters, platformFilter]);

  const ranked = useMemo(() => {
    return filtered
      .map((car) => ({ car, score: modelWeightedScore(car, weights) }))
      .sort((a, b) => (sortBy === "score" ? b.score - a.score : bestListing(a.car).price - bestListing(b.car).price));
  }, [filtered, weights, sortBy]);

  const selectedEntry =
    ranked.find((r) => r.car.id === selectedCarId) ??
    (() => {
      const car = cars.find((c) => c.id === selectedCarId);
      return car ? { car, score: modelWeightedScore(car, weights) } : undefined;
    })();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar — sticky + a fade mask below it so cards dissolve smoothly as they scroll
          underneath, instead of cutting off hard at the header's edge. */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 40 }}>
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 1180, padding: "16px 32px" }}
        >
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--mid)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="var(--mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to filters
          </Link>
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-lg gradient-brand"
              style={{ width: 26, height: 26 }}
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-sm">RankAutos</span>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none"
        style={{ position: "sticky", top: 57, zIndex: 39, height: 18, marginBottom: -18, background: "linear-gradient(to bottom, var(--bg), transparent)" }}
      />

      <div className="mx-auto" style={{ maxWidth: 1180, padding: "28px 32px 110px" }}>
        <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 20 }}>
          <div>
            <div className="text-lg font-bold">Step 2 — Your rankings</div>
            <div className="text-xs" style={{ color: "var(--mid)", marginTop: 2 }}>
              {ranked.length} model{ranked.length !== 1 ? "s" : ""} match your filters
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full" style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 3 }}>
            {(["score", "price"] as const).map((s) => {
              const active = sortBy === s;
              return (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs font-semibold rounded-full capitalize transition-all duration-150 ${active ? "gradient-brand text-white" : ""}`}
                  style={{ padding: "6px 16px", color: active ? "#fff" : "var(--mid)" }}
                >
                  Sort: {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:[grid-template-columns:minmax(0,320px)_1fr]">
          {/* Sidebar */}
          <aside id="criteria" className="self-start lg:sticky" style={{ top: 24, scrollMarginTop: 90 }}>
            <div
              className="rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 20, boxShadow: "var(--shadow)" }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div className="text-sm font-bold">Your priorities</div>
                <button onClick={reset} className="text-xs font-semibold" style={{ color: "var(--grad-2)" }}>
                  Reset
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {CRITERIA.map((c) => (
                  <WeightSlider
                    key={c.key}
                    criterion={c}
                    value={weights[c.key]}
                    onChange={(v) => setWeights((w) => ({ ...w, [c.key]: v }))}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Results list */}
          <div id="rankings" className="flex flex-col gap-2" style={{ scrollMarginTop: 90 }}>
            {ranked.length === 0 ? (
              <div
                className="text-center rounded-2xl"
                style={{ padding: "60px 20px", color: "var(--mid)", background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                No cars match your filters.{" "}
                <Link href="/" className="font-semibold" style={{ color: "var(--grad-2)" }}>
                  Adjust filters
                </Link>
              </div>
            ) : (
              ranked.map(({ car, score }, i) => (
                <ResultCard key={car.id} car={car} rank={i + 1} score={score} onClick={() => setSelectedCarId(car.id)} />
              ))
            )}
          </div>
        </div>
      </div>

      {selectedEntry && (
        <CarDetailModal
          car={selectedEntry.car}
          score={selectedEntry.score}
          weights={weights}
          platformFilter={platformFilter}
          onClose={() => setSelectedCarId(null)}
        />
      )}
    </div>
  );
}
