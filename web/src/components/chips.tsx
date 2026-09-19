"use client";

import type { BodyType, Fuel, Platform } from "@/lib/types";
import { BODY_SVGS, FUEL_ICONS } from "./icons";

export function BodyChip({
  type,
  active,
  onClick,
}: {
  type: BodyType;
  active: boolean;
  onClick: () => void;
}) {
  const Svg = BODY_SVGS[type];
  const c = active ? "#fff" : "var(--mid)";
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-[5px] rounded-2xl transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
      style={{
        padding: "10px 12px",
        minWidth: 90,
        background: active ? undefined : "var(--surface)",
        border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
      }}
    >
      {Svg(c)}
      <span className="text-[11px] font-semibold" style={{ color: c }}>
        {type}
      </span>
    </button>
  );
}

export function FuelChip({
  fuel,
  active,
  onClick,
}: {
  fuel: Fuel;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = FUEL_ICONS[fuel];
  const c = active ? "#fff" : "var(--mid)";
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[7px] rounded-full transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
      style={{
        padding: "8px 14px",
        background: active ? undefined : "var(--surface)",
        color: c,
        border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
      }}
    >
      {Icon(c)}
      <span className="text-[13px] font-semibold">{fuel}</span>
    </button>
  );
}

export function PlatformChip({
  platform,
  active,
  onClick,
}: {
  platform: Platform;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full transition-all duration-150 ${active ? "gradient-brand" : ""}`}
      style={{
        padding: "6px 12px",
        background: active ? undefined : "var(--surface)",
        border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
      }}
    >
      <span className="text-sm">{platform.flag}</span>
      <span
        className="text-xs font-semibold"
        style={{ color: active ? "#fff" : "var(--mid)" }}
      >
        {platform.label}
      </span>
    </button>
  );
}
