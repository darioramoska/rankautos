"use client";

import { useState } from "react";

export function FilterGroup({
  label,
  count,
  icon,
  children,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow duration-200"
      style={{
        border: `1.5px solid ${open ? "transparent" : "var(--border)"}`,
        background: "var(--surface)",
        boxShadow: open ? "var(--shadow-lg)" : "none",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between"
        style={{ padding: "12px 16px" }}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center justify-center rounded-xl flex-shrink-0 ${open ? "tile-soft-active" : "tile-soft"}`}
            style={{ width: 44, height: 44 }}
          >
            {icon}
          </span>
          <span className="text-sm font-bold">{label}</span>
          {count > 0 && (
            <span
              className="text-[11px] font-bold rounded-full gradient-brand"
              style={{ color: "#fff", padding: "2px 9px" }}
            >
              {count} selected
            </span>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M4 6l4 4 4-4" stroke="var(--mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 16px 18px", borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
