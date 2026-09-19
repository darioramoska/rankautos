"use client";

import { fmt } from "@/lib/scoring";

const BUDGET_MIN = 0;
const BUDGET_MAX = 80000;
const BUDGET_STEP = 2500;

const PRESETS = [
  { label: "Any", mn: 0, mx: 80000 },
  { label: "Under €25k", mn: 0, mx: 25000 },
  { label: "€25–40k", mn: 25000, mx: 40000 },
  { label: "€40–60k", mn: 40000, mx: 60000 },
  { label: "€60k+", mn: 60000, mx: 80000 },
];

export function BudgetRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const pct = (v: number) => ((v - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
  const leftPct = pct(min);
  const rightPct = pct(max);
  const activePreset = PRESETS.find((p) => p.mn === min && p.mx === max);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => {
          const active = activePreset?.label === p.label;
          return (
            <button
              key={p.label}
              onClick={() => onChange(p.mn, p.mx)}
              className={`rounded-full text-xs font-semibold transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
              style={{
                padding: "5px 12px",
                background: active ? undefined : "var(--surface)",
                color: active ? "#fff" : "var(--mid)",
                border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mb-2.5 text-[13px]">
        <span className="font-bold" style={{ color: "var(--dark)" }}>
          {min === 0 ? "Any" : `€${fmt(min)}`}
        </span>
        <span style={{ color: "var(--mid)" }} className="text-xs font-medium">
          to
        </span>
        <span className="font-bold" style={{ color: "var(--dark)" }}>
          {max >= BUDGET_MAX ? "€80,000+" : `€${fmt(max)}`}
        </span>
      </div>
      <div className="dual-range">
        <div
          className="absolute left-0 right-0 rounded-full"
          style={{ height: 4, background: "var(--border)" }}
        />
        <div
          className="absolute rounded-full gradient-brand"
          style={{
            left: `${leftPct}%`,
            width: `${rightPct - leftPct}%`,
            height: 4,
          }}
        />
        <input
          type="range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={min}
          onChange={(e) => {
            const v = +e.target.value;
            if (v < max - BUDGET_STEP) onChange(v, max);
          }}
        />
        <input
          type="range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={max}
          onChange={(e) => {
            const v = +e.target.value;
            if (v > min + BUDGET_STEP) onChange(min, v);
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--mid)" }}>
        <span>€0</span>
        <span>€20k</span>
        <span>€40k</span>
        <span>€60k</span>
        <span>€80k+</span>
      </div>
    </div>
  );
}
