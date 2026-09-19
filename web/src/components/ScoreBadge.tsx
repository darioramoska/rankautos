"use client";

import { scoreColor } from "@/lib/scoring";

export function ScoreBadge({ score, size = 56 }: { score: number; size?: number }) {
  const col = scoreColor(score);
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const strokeW = size < 44 ? 3 : 4;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col + "22"} strokeWidth={strokeW} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={strokeW}
          strokeDasharray={`${(score / 10) * circ} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{
          fontSize: size < 44 ? 10 : size < 60 ? 13 : 16,
          color: col,
        }}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}
