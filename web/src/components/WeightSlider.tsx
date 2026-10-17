"use client";

import { useState } from "react";
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
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex items-center gap-3.5">
      <div className="flex-shrink-0 relative" style={{ width: 150 }}>
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold truncate">{criterion.label}</span>
          <button
            type="button"
            onClick={() => setShowInfo((s) => !s)}
            onBlur={() => setShowInfo(false)}
            aria-label={`About ${criterion.label}`}
            aria-expanded={showInfo}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 14,
              height: 14,
              fontSize: 9,
              lineHeight: 1,
              fontWeight: 700,
              color: "var(--mid)",
              background: "var(--bg)",
              border: "1px solid var(--border)",
            }}
          >
            i
          </button>
        </div>
        {showInfo && (
          <div
            className="absolute text-[11px]"
            style={{
              top: "100%",
              left: 0,
              marginTop: 6,
              width: 200,
              padding: "8px 10px",
              borderRadius: 10,
              background: "var(--ink)",
              color: "#fff",
              zIndex: 20,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {criterion.desc}
          </div>
        )}
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
