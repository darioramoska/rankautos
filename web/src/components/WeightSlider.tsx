"use client";

import type { Criterion } from "@/lib/types";

export function WeightSlider({
  criterion,
  value,
  onChange,
}: {
  criterion: Criterion;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex-shrink-0" style={{ width: 150 }}>
        <div className="text-[13px] font-semibold">{criterion.label}</div>
        <div className="text-[11px] mt-px" style={{ color: "var(--mid)" }}>
          {criterion.desc}
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="flex-1 min-w-0"
      />
      <div
        className="text-right font-bold text-sm"
        style={{ width: 22, color: value === 0 ? "var(--border)" : "var(--accent)" }}
      >
        {value}
      </div>
    </div>
  );
}
