"use client";

import { COUNTRIES, EXTERIOR_COLORS, MANUFACTURERS, PLATFORMS } from "@/lib/data";
import type { BodyType, Filters, Fuel } from "@/lib/types";
import { BodyChip, FuelChip, PlatformChip } from "./chips";
import { BudgetRange } from "./BudgetRange";
import { FilterGroup } from "./FilterGroup";

const BODY_TYPES: BodyType[] = ["SUV", "Crossover", "Hatchback", "Sedan", "Estate"];
const FUELS: Fuel[] = ["Electric", "Hybrid", "Petrol", "Diesel"];
const BOOT_MAX = 1200;

export function HomeScreen({
  onStart,
  filters,
  setFilters,
}: {
  onStart: () => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const toggleArr = (key: keyof Filters, val: string) =>
    setFilters((f) => {
      const arr = (f[key] as string[]) || [];
      return {
        ...f,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });

  const fuelCount = filters.fuel.length;
  const typeCount = filters.type.length;
  const platformCount = filters.platforms.length;
  const countryCount = (filters.countries || []).length;
  const hasBudget = filters.budgetMin > 0 || filters.budgetMax < 80000;
  const hasRange = (filters.minRange || 0) > 0;
  const hasSeats = filters.seats > 0;
  const hasYear = (filters.yearMin || 0) > 0;
  const hasBoot = (filters.minBoot || 0) > 0 || (filters.maxBoot || 1200) < 1200;
  const transCount = (filters.transmission || []).length;
  const colorCount = (filters.colors || []).length;
  const activeFilterCount =
    (filters.manufacturer ? 1 : 0) +
    (fuelCount > 0 ? 1 : 0) +
    (typeCount > 0 ? 1 : 0) +
    (platformCount > 0 ? 1 : 0) +
    (countryCount > 0 ? 1 : 0) +
    (hasBudget ? 1 : 0) +
    (hasRange ? 1 : 0) +
    (hasSeats ? 1 : 0) +
    (hasYear ? 1 : 0) +
    (transCount > 0 ? 1 : 0) +
    (colorCount > 0 ? 1 : 0) +
    (hasBoot ? 1 : 0);

  const clearAll = () =>
    setFilters({
      manufacturer: "",
      fuel: [],
      type: [],
      budgetMin: 0,
      budgetMax: 80000,
      seats: 0,
      yearMin: 0,
      platforms: [],
      countries: [],
      minRange: 0,
      transmission: [],
      colors: [],
      minBoot: 0,
      maxBoot: 1200,
    });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact header — full hero/how-it-works content now lives in onboarding and Profile > Help.
          Sticky + a fade mask below it so cards dissolve smoothly as they scroll underneath,
          instead of cutting off hard at the header's edge. */}
      <div className="gradient-hero" style={{ padding: "20px 32px", position: "sticky", top: 0, zIndex: 40 }}>
        <div className="mx-auto flex items-center gap-2.5" style={{ maxWidth: 860 }}>
          <div className="flex items-center justify-center rounded-xl gradient-brand shadow-glow" style={{ width: 30, height: 30 }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold text-white text-base" style={{ letterSpacing: "-0.3px" }}>
            RankAutos
          </span>
          <span className="text-[10px] rounded-full" style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", color: "rgba(255,255,255,0.5)" }}>
            Pan-European
          </span>
        </div>
      </div>
      <div
        className="pointer-events-none"
        style={{ position: "sticky", top: 68, zIndex: 39, height: 22, marginBottom: -22, background: "linear-gradient(to bottom, var(--bg), transparent)" }}
      />

      {/* Filters */}
      <div className="flex-1 mx-auto w-full" style={{ maxWidth: 860, padding: "32px 32px 140px" }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
          <div>
            <div className="text-base font-bold">Step 1 — Set your filters</div>
            <div className="text-xs" style={{ color: "var(--mid)", marginTop: 2 }}>
              All filters are optional — skip any to see all options
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs rounded-lg"
              style={{ color: "var(--mid)", padding: "5px 12px", border: "1px solid var(--border)" }}
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        <div className="grid gap-2.5 md:grid-cols-2 md:items-start">
          {/* Manufacturer */}
          <FilterGroup
            label="Manufacturer"
            count={filters.manufacturer ? 1 : 0}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7.5 3v5.4c0 4.6-3.1 8.1-7.5 9.6-4.4-1.5-7.5-5-7.5-9.6V6L12 3z" /><path d="M8.8 12l2.3 2.3 4.2-4.6" /></svg>}
          >
            <div style={{ paddingTop: 14, position: "relative" }}>
              <select
                value={filters.manufacturer}
                onChange={(e) => setFilters((f) => ({ ...f, manufacturer: e.target.value }))}
                className="w-full text-sm font-semibold"
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  background: "var(--surface)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "11px 40px 11px 14px",
                  color: filters.manufacturer ? "var(--ink)" : "var(--mid)",
                }}
              >
                <option value="">All manufacturers</option>
                {MANUFACTURERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <path d="M4 6l4 4 4-4" stroke="var(--mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </FilterGroup>

          {/* Fuel */}
          <FilterGroup
            label="Fuel Type"
            count={fuelCount}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V5.5A2.5 2.5 0 017.5 3h5A2.5 2.5 0 0115 5.5V21" /><line x1="3.5" y1="21" x2="16.5" y2="21" /><path d="M8 8h4" /><path d="M15 9.5h1.6a1.9 1.9 0 011.9 1.9v5.1a1.5 1.5 0 003 0V9l-2.6-2.6" /></svg>}
          >
            <div className="flex flex-wrap gap-2.5" style={{ paddingTop: 14 }}>
              {FUELS.map((f) => (
                <FuelChip key={f} fuel={f} active={filters.fuel.includes(f)} onClick={() => toggleArr("fuel", f)} />
              ))}
            </div>
          </FilterGroup>

          {/* Transmission */}
          <FilterGroup
            label="Transmission"
            count={(filters.transmission || []).length}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="4" x2="6" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /><line x1="18" y1="4" x2="18" y2="20" /><line x1="6" y1="12" x2="18" y2="12" /><circle cx="6" cy="4" r="1.4" /><circle cx="12" cy="4" r="1.4" /><circle cx="18" cy="4" r="1.4" /></svg>}
          >
            <div className="flex gap-2" style={{ paddingTop: 14 }}>
              {(["Automatic", "Manual"] as const).map((t) => {
                const active = (filters.transmission || []).includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleArr("transmission", t)}
                    className={`flex items-center gap-2 rounded-full text-[13px] font-semibold transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
                    style={{
                      padding: "10px 20px",
                      background: active ? undefined : "var(--surface)",
                      color: active ? "#fff" : "var(--mid)",
                      border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
                    }}
                  >
                    {t === "Automatic" ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="6" width="14" height="4" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
                        <circle cx="3.5" cy="8" r="1" fill="currentColor" opacity="0.3" />
                        <circle cx="6.5" cy="8" r="1" fill="currentColor" opacity="0.3" />
                        <circle cx="9.5" cy="8" r="1" fill="currentColor" opacity="0.3" />
                        <circle cx="12.5" cy="8" r="1.6" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <line x1="4" y1="2" x2="4" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        <line x1="12" y1="2" x2="12" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        <circle cx="4" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
                        <circle cx="12" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
                      </svg>
                    )}
                    {t}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Body type */}
          <FilterGroup
            label="Body Type"
            count={typeCount}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 15.5v-3.2l2-4.6A2 2 0 017.3 6.5h9.4a2 2 0 011.8 1.2l2 4.6v3.2" /><line x1="3.5" y1="12.5" x2="20.5" y2="12.5" /><circle cx="7.5" cy="16.5" r="2" /><circle cx="16.5" cy="16.5" r="2" /></svg>}
          >
            <div className="flex flex-wrap gap-2.5" style={{ paddingTop: 14 }}>
              {BODY_TYPES.map((t) => (
                <BodyChip key={t} type={t} active={filters.type.includes(t)} onClick={() => toggleArr("type", t)} />
              ))}
            </div>
          </FilterGroup>

          {/* Budget */}
          <FilterGroup
            label="Budget Range"
            count={hasBudget ? 1 : 0}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M14.8 9a3.6 3.6 0 100 6" /><line x1="8" y1="10.8" x2="13.4" y2="10.8" /><line x1="8" y1="13.2" x2="13.4" y2="13.2" /></svg>}
          >
            <div style={{ paddingTop: 14 }}>
              <BudgetRange
                min={filters.budgetMin}
                max={filters.budgetMax}
                onChange={(mn, mx) => setFilters((f) => ({ ...f, budgetMin: mn, budgetMax: mx }))}
              />
            </div>
          </FilterGroup>

          {/* Country */}
          <FilterGroup
            label="Country / Market"
            count={countryCount}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="3" y1="12" x2="21" y2="12" /><path d="M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" /></svg>}
          >
            <div style={{ paddingTop: 14 }}>
              <div className="text-xs" style={{ color: "var(--mid)", marginBottom: 10 }}>
                Where do you want to buy?
              </div>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map((c) => {
                  const active = (filters.countries || []).includes(c.code);
                  return (
                    <button
                      key={c.code}
                      onClick={() => toggleArr("countries", c.code)}
                      className={`flex items-center gap-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
                      style={{
                        padding: "6px 12px",
                        background: active ? undefined : "var(--surface)",
                        color: active ? "#fff" : "var(--mid)",
                        border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
                      }}
                    >
                      <span className="text-base">{c.flag}</span>
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </FilterGroup>

          {/* Platforms */}
          <FilterGroup
            label="Platforms to Scan"
            count={platformCount}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="10.5" r="6.5" /><line x1="15.3" y1="15.3" x2="20.5" y2="20.5" /></svg>}
          >
            <div style={{ paddingTop: 14 }}>
              <div className="text-xs" style={{ color: "var(--mid)", marginBottom: 10 }}>
                All platforms scanned by default
              </div>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <PlatformChip
                    key={p.id}
                    platform={p}
                    active={filters.platforms.length === 0 || filters.platforms.includes(p.id)}
                    onClick={() => {
                      setFilters((f) => {
                        const isAll = f.platforms.length === 0;
                        if (isAll) return { ...f, platforms: PLATFORMS.filter((x) => x.id !== p.id).map((x) => x.id) };
                        const next = f.platforms.includes(p.id)
                          ? f.platforms.filter((x) => x !== p.id)
                          : [...f.platforms, p.id];
                        return { ...f, platforms: next.length === PLATFORMS.length ? [] : next };
                      });
                    }}
                  />
                ))}
                {filters.platforms.length > 0 && (
                  <button
                    onClick={() => setFilters((f) => ({ ...f, platforms: [] }))}
                    className="rounded-full text-xs"
                    style={{ padding: "6px 12px", color: "var(--mid)", border: "1px dashed var(--border)" }}
                  >
                    Select all
                  </button>
                )}
              </div>
            </div>
          </FilterGroup>

          {/* Driving range */}
          <FilterGroup
            label="Minimum Driving Range"
            count={hasRange ? 1 : 0}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 17a8.5 8.5 0 1117 0" /><line x1="12" y1="17" x2="16" y2="11.5" /><circle cx="12" cy="17" r="1.2" /></svg>}
          >
            <div style={{ paddingTop: 14 }}>
              <div className="flex justify-between" style={{ marginBottom: 10 }}>
                <span className="text-xs" style={{ color: "var(--mid)" }}>
                  Minimum range
                </span>
                <span className="text-sm font-bold">
                  {(filters.minRange || 0) === 0 ? "Any" : `${filters.minRange} km+`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="700"
                step="50"
                value={filters.minRange || 0}
                onChange={(e) => setFilters((f) => ({ ...f, minRange: +e.target.value }))}
              />
              <div className="flex justify-between text-[11px]" style={{ color: "var(--mid)", marginTop: 4 }}>
                <span>Any</span>
                <span>200 km</span>
                <span>400 km</span>
                <span>600 km</span>
                <span>700 km+</span>
              </div>
            </div>
          </FilterGroup>

          {/* Car color */}
          <FilterGroup
            label="Exterior Colour"
            count={(filters.colors || []).length}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9.2" r="4.6" /><circle cx="15" cy="9.2" r="4.6" /><circle cx="12" cy="15" r="4.6" /></svg>}
          >
            <div style={{ paddingTop: 14 }}>
              <div className="flex flex-wrap gap-2.5">
                {EXTERIOR_COLORS.map((c) => {
                  const active = (filters.colors || []).includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleArr("colors", c.name)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
                      style={{
                        padding: "8px 12px",
                        background: active ? undefined : "var(--surface)",
                        border: `2px solid ${active ? "transparent" : "var(--border)"}`,
                      }}
                    >
                      <div
                        className="rounded-full"
                        style={{
                          width: 32,
                          height: 32,
                          background: c.hex,
                          border: `2px solid ${c.border}`,
                          boxShadow: active ? "0 0 0 2px var(--accent)" : "none",
                        }}
                      />
                      <span className="text-[11px] font-semibold" style={{ color: active ? "#fff" : "var(--mid)" }}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </FilterGroup>

          {/* Registration year */}
          <FilterGroup
            label="Registration Year"
            count={hasYear ? 1 : 0}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6.5h16v13H4z M4 10.5h16 M8 4v4 M16 4v4" /></svg>}
          >
            <div className="flex flex-wrap gap-2" style={{ paddingTop: 14 }}>
              {[0, 2024, 2022, 2020, 2018, 2015, 2010].map((y) => {
                const active = (filters.yearMin || 0) === y;
                return (
                  <button
                    key={y}
                    onClick={() => setFilters((f) => ({ ...f, yearMin: y }))}
                    className={`rounded-full text-[13px] font-semibold transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
                    style={{
                      padding: "7px 16px",
                      background: active ? undefined : "var(--surface)",
                      color: active ? "#fff" : "var(--mid)",
                      border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
                    }}
                  >
                    {y === 0 ? "Any" : `${y}+`}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Seats */}
          <FilterGroup
            label="Minimum Seats"
            count={hasSeats ? 1 : 0}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20.5c0-4.1 3.4-7.2 7.5-7.2s7.5 3.1 7.5 7.2" /></svg>}
          >
            <div className="flex gap-2" style={{ paddingTop: 14 }}>
              {[0, 2, 4, 5, 7].map((s) => {
                const active = filters.seats === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilters((f) => ({ ...f, seats: s }))}
                    className={`rounded-full text-[13px] font-semibold transition-all duration-150 ${active ? "gradient-brand shadow-glow" : ""}`}
                    style={{
                      padding: "7px 16px",
                      background: active ? undefined : "var(--surface)",
                      color: active ? "#fff" : "var(--mid)",
                      border: `1.5px solid ${active ? "transparent" : "var(--border)"}`,
                    }}
                  >
                    {s === 0 ? "Any" : `${s}+`}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Boot space */}
          <FilterGroup
            label="Boot Space Range"
            count={hasBoot ? 1 : 0}
            icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="8" width="17" height="12.5" rx="3" /><path d="M9 8V6.5A2 2 0 0111 4.5h2a2 2 0 012 2V8" /><line x1="3.5" y1="13.2" x2="20.5" y2="13.2" /></svg>}
          >
            <div style={{ paddingTop: 14 }}>
              <div className="flex justify-between text-[13px]" style={{ marginBottom: 10 }}>
                <span className="font-bold">{(filters.minBoot || 0) === 0 ? "Any" : `${filters.minBoot} L`}</span>
                <span className="text-xs" style={{ color: "var(--mid)" }}>
                  to
                </span>
                <span className="font-bold">
                  {(filters.maxBoot || BOOT_MAX) >= BOOT_MAX ? `${BOOT_MAX} L+` : `${filters.maxBoot} L`}
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
                    left: `${((filters.minBoot || 0) / BOOT_MAX) * 100}%`,
                    width: `${(((filters.maxBoot || BOOT_MAX) - (filters.minBoot || 0)) / BOOT_MAX) * 100}%`,
                    height: 4,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max={BOOT_MAX}
                  step="50"
                  value={filters.minBoot || 0}
                  onChange={(e) => {
                    const v = +e.target.value;
                    if (v < (filters.maxBoot || BOOT_MAX) - 50) setFilters((f) => ({ ...f, minBoot: v }));
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max={BOOT_MAX}
                  step="50"
                  value={filters.maxBoot || BOOT_MAX}
                  onChange={(e) => {
                    const v = +e.target.value;
                    if (v > (filters.minBoot || 0) + 50) setFilters((f) => ({ ...f, maxBoot: v }));
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px]" style={{ color: "var(--mid)", marginTop: 4 }}>
                <span>0</span>
                <span>300 L</span>
                <span>600 L</span>
                <span>900 L</span>
                <span>1200 L</span>
              </div>
            </div>
          </FilterGroup>
        </div>

        {/* CTA */}
        <div className="flex items-center flex-wrap gap-4" style={{ marginTop: 28 }}>
          <button
            onClick={onStart}
            className="flex items-center gap-2.5 font-bold text-[15px] transition-all duration-100 hover:-translate-y-px gradient-brand shadow-glow"
            style={{
              padding: "16px 36px",
              color: "#fff",
              borderRadius: "var(--radius)",
            }}
          >
            Step 2 — See Rankings
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {activeFilterCount > 0 && (
            <span className="text-[13px]" style={{ color: "var(--mid)" }}>
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
