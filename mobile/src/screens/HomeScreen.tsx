// Ported from web/src/components/HomeScreen.tsx. The hero/steps/how-it-works/disclaimer
// content that used to live inline here now lives in Onboarding (first launch) and
// Profile > Help / Disclaimer — see src/components/info/*. This screen is just the
// compact header + filter form.
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { COUNTRIES, EXTERIOR_COLORS, MANUFACTURERS, PLATFORMS } from "../lib/data";
import type { BodyType, Filters, Fuel } from "../lib/types";
import { colors, fonts, gradientBrand, gradientHero, radius, shadow } from "../lib/theme";
import { BodyChip, FuelChip, PlatformChip } from "../components/chips";
import { BudgetRange } from "../components/BudgetRange";
import { DualRangeSlider } from "../components/DualRangeSlider";
import { Dropdown } from "../components/Dropdown";
import { FilterGroup } from "../components/FilterGroup";
import { GradientPill } from "../components/GradientPill";
import Slider from "@react-native-assets/slider";

const BODY_TYPES: BodyType[] = ["SUV", "Crossover", "Hatchback", "Sedan", "Estate"];
const FUELS: Fuel[] = ["Electric", "Hybrid", "PHEV", "Petrol", "Diesel"];
const BOOT_MAX = 1200;

export function HomeScreen({
  filters,
  setFilters,
  onStart,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onStart: () => void;
}) {
  const toggleArr = (key: keyof Filters, val: string) =>
    setFilters((f) => {
      const arr = (f[key] as string[]) || [];
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
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
    <View style={styles.screen}>
      {/* Compact header — fixed above the scroll area (not part of it), full hero/how-it-works
          content now lives in onboarding and Profile > Help */}
      <LinearGradient colors={gradientHero} start={{ x: 0.05, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.header}>
        <LinearGradient colors={gradientBrand} style={styles.logoTile}>
          <Svg width={14} height={14} viewBox="0 0 18 18" fill="none">
            <Path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </LinearGradient>
        <Text style={styles.logoText}>RankAutos</Text>
        <View style={styles.euroPill}>
          <Text style={styles.euroPillText}>Pan-European</Text>
        </View>
      </LinearGradient>

      <View style={styles.scrollArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      {/* Filters */}
      <View style={styles.section}>
        <View style={styles.filtersHeader}>
          <View>
            <Text style={styles.filtersTitle}>Step 1 — Set your filters</Text>
            <Text style={styles.filtersSubtitle}>All filters are optional — skip any to see all options</Text>
          </View>
          {activeFilterCount > 0 && (
            <Pressable onPress={clearAll} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear all ({activeFilterCount})</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.filterGroups}>
          <FilterGroup label="Manufacturer" count={filters.manufacturer ? 1 : 0} icon={<ManufacturerIcon />}>
            <Dropdown
              value={filters.manufacturer}
              options={MANUFACTURERS}
              placeholder="All manufacturers"
              onChange={(v) => setFilters((f) => ({ ...f, manufacturer: v }))}
            />
          </FilterGroup>

          <FilterGroup label="Fuel Type" count={fuelCount} icon={<FuelIcon />}>
            <View style={styles.wrapRow}>
              {FUELS.map((f) => (
                <FuelChip key={f} fuel={f} active={filters.fuel.includes(f)} onClick={() => toggleArr("fuel", f)} />
              ))}
            </View>
          </FilterGroup>

          <FilterGroup label="Transmission" count={transCount} icon={<TransIcon />}>
            <View style={styles.rowGap}>
              {(["Automatic", "Manual"] as const).map((t) => {
                const active = (filters.transmission || []).includes(t);
                return (
                  <GradientPill key={t} active={active} onPress={() => toggleArr("transmission", t)} style={styles.transPill}>
                    <Text style={[styles.transLabel, { color: active ? "#fff" : colors.mid }]}>{t}</Text>
                  </GradientPill>
                );
              })}
            </View>
          </FilterGroup>

          <FilterGroup label="Body Type" count={typeCount} icon={<BodyIcon />}>
            <View style={styles.wrapRow}>
              {BODY_TYPES.map((t) => (
                <BodyChip key={t} type={t} active={filters.type.includes(t)} onClick={() => toggleArr("type", t)} />
              ))}
            </View>
          </FilterGroup>

          <FilterGroup label="Budget Range" count={hasBudget ? 1 : 0} icon={<BudgetIcon />}>
            <BudgetRange
              min={filters.budgetMin}
              max={filters.budgetMax}
              onChange={(mn, mx) => setFilters((f) => ({ ...f, budgetMin: mn, budgetMax: mx }))}
            />
          </FilterGroup>

          <FilterGroup label="Country / Market" count={countryCount} icon={<CountryIcon />}>
            <Text style={styles.helperText}>Where do you want to buy?</Text>
            <View style={styles.wrapRowSm}>
              {COUNTRIES.map((c) => {
                const active = (filters.countries || []).includes(c.code);
                return (
                  <GradientPill key={c.code} active={active} onPress={() => toggleArr("countries", c.code)} style={styles.countryPill}>
                    <Text style={styles.countryFlag}>{c.flag}</Text>
                    <Text style={[styles.countryLabel, { color: active ? "#fff" : colors.mid }]}>{c.name}</Text>
                  </GradientPill>
                );
              })}
            </View>
          </FilterGroup>

          <FilterGroup label="Platforms to Scan" count={platformCount} icon={<SearchIcon />}>
            <Text style={styles.helperText}>All platforms scanned by default</Text>
            <View style={styles.wrapRowSm}>
              {PLATFORMS.map((p) => (
                <PlatformChip
                  key={p.id}
                  platform={p}
                  active={filters.platforms.length === 0 || filters.platforms.includes(p.id)}
                  onClick={() => {
                    setFilters((f) => {
                      const isAll = f.platforms.length === 0;
                      if (isAll) return { ...f, platforms: PLATFORMS.filter((x) => x.id !== p.id).map((x) => x.id) };
                      const next = f.platforms.includes(p.id) ? f.platforms.filter((x) => x !== p.id) : [...f.platforms, p.id];
                      return { ...f, platforms: next.length === PLATFORMS.length ? [] : next };
                    });
                  }}
                />
              ))}
              {filters.platforms.length > 0 && (
                <Pressable onPress={() => setFilters((f) => ({ ...f, platforms: [] }))} style={styles.selectAllBtn}>
                  <Text style={styles.selectAllText}>Select all</Text>
                </Pressable>
              )}
            </View>
          </FilterGroup>

          <FilterGroup label="Minimum Driving Range" count={hasRange ? 1 : 0} icon={<RangeIcon />}>
            <View style={styles.sliderHeaderRow}>
              <Text style={styles.helperText}>Minimum range</Text>
              <Text style={styles.sliderValue}>{(filters.minRange || 0) === 0 ? "Any" : `${filters.minRange} km+`}</Text>
            </View>
            <Slider
              value={filters.minRange || 0}
              minimumValue={0}
              maximumValue={700}
              step={50}
              minimumTrackTintColor={colors.grad2}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.grad3}
              trackHeight={4}
              thumbSize={18}
              style={styles.singleSlider}
              onValueChange={(v) => setFilters((f) => ({ ...f, minRange: v }))}
            />
            <View style={styles.scaleRow}>
              <Text style={styles.scaleText}>Any</Text>
              <Text style={styles.scaleText}>200 km</Text>
              <Text style={styles.scaleText}>400 km</Text>
              <Text style={styles.scaleText}>600 km</Text>
              <Text style={styles.scaleText}>700 km+</Text>
            </View>
          </FilterGroup>

          <FilterGroup label="Exterior Colour" count={colorCount} icon={<ColorIcon />}>
            <View style={styles.wrapRow}>
              {EXTERIOR_COLORS.map((c) => {
                const active = (filters.colors || []).includes(c.name);
                return (
                  <GradientPill key={c.name} active={active} onPress={() => toggleArr("colors", c.name)} borderRadius={16} style={styles.colorPill}>
                    <View style={styles.colorPillInner}>
                      <View style={[styles.colorSwatch, { backgroundColor: c.hex, borderColor: active ? colors.accent : c.border }]} />
                      <Text style={[styles.colorLabel, { color: active ? "#fff" : colors.mid }]}>{c.name}</Text>
                    </View>
                  </GradientPill>
                );
              })}
            </View>
          </FilterGroup>

          <FilterGroup label="Registration Year" count={hasYear ? 1 : 0} icon={<YearIcon />}>
            <View style={styles.rowGap}>
              {[0, 2024, 2022, 2020, 2018, 2015, 2010].map((y) => {
                const active = (filters.yearMin || 0) === y;
                return (
                  <GradientPill key={y} active={active} onPress={() => setFilters((f) => ({ ...f, yearMin: y }))} style={styles.seatPill}>
                    <Text style={[styles.seatLabel, { color: active ? "#fff" : colors.mid }]}>{y === 0 ? "Any" : `${y}+`}</Text>
                  </GradientPill>
                );
              })}
            </View>
          </FilterGroup>

          <FilterGroup label="Minimum Seats" count={hasSeats ? 1 : 0} icon={<SeatsIcon />}>
            <View style={styles.rowGap}>
              {[0, 2, 4, 5, 7].map((s) => {
                const active = filters.seats === s;
                return (
                  <GradientPill key={s} active={active} onPress={() => setFilters((f) => ({ ...f, seats: s }))} style={styles.seatPill}>
                    <Text style={[styles.seatLabel, { color: active ? "#fff" : colors.mid }]}>{s === 0 ? "Any" : `${s}+`}</Text>
                  </GradientPill>
                );
              })}
            </View>
          </FilterGroup>

          <FilterGroup label="Boot Space Range" count={hasBoot ? 1 : 0} icon={<BootIcon />}>
            <View style={styles.valueRow}>
              <Text style={styles.valueText}>{(filters.minBoot || 0) === 0 ? "Any" : `${filters.minBoot} L`}</Text>
              <Text style={styles.toText}>to</Text>
              <Text style={styles.valueText}>
                {(filters.maxBoot || BOOT_MAX) >= BOOT_MAX ? `${BOOT_MAX} L+` : `${filters.maxBoot} L`}
              </Text>
            </View>
            <DualRangeSlider
              min={0}
              max={BOOT_MAX}
              low={filters.minBoot || 0}
              high={filters.maxBoot || BOOT_MAX}
              step={50}
              onChange={(mn, mx) => setFilters((f) => ({ ...f, minBoot: mn, maxBoot: mx }))}
            />
            <View style={styles.scaleRow}>
              <Text style={styles.scaleText}>0</Text>
              <Text style={styles.scaleText}>300 L</Text>
              <Text style={styles.scaleText}>600 L</Text>
              <Text style={styles.scaleText}>900 L</Text>
              <Text style={styles.scaleText}>1200 L</Text>
            </View>
          </FilterGroup>
        </View>

        {/* CTA */}
        <View style={styles.ctaRow}>
          <Pressable onPress={onStart} style={shadow.glow}>
            <LinearGradient colors={gradientBrand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaBtn}>
              <Text style={styles.ctaText}>Step 2 — See Rankings</Text>
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </LinearGradient>
          </Pressable>
          {activeFilterCount > 0 && (
            <Text style={styles.ctaHint}>
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
            </Text>
          )}
        </View>
      </View>
      </ScrollView>
      <LinearGradient colors={[colors.bg, colors.bg + "00"]} pointerEvents="none" style={styles.scrollFade} />
      </View>
    </View>
  );
}

// ─── small inline filter-group icons (kept local — each used exactly once) ──────────────────
function ManufacturerIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d={"M12 3l7.5 3v5.4c0 4.6-3.1 8.1-7.5 9.6-4.4-1.5-7.5-5-7.5-9.6V6L12 3z"} />
      <Path d={"M8.8 12l2.3 2.3 4.2-4.6"} />
    </Svg>
  );
}
function FuelIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d={"M5 21V5.5A2.5 2.5 0 017.5 3h5A2.5 2.5 0 0115 5.5V21"} />
      <Line x1={3.5} y1={21} x2={16.5} y2={21} />
      <Path d={"M8 8h4"} />
      <Path d={"M15 9.5h1.6a1.9 1.9 0 011.9 1.9v5.1a1.5 1.5 0 003 0V9l-2.6-2.6"} />
    </Svg>
  );
}
function TransIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Line x1={6} y1={4} x2={6} y2={20} />
      <Line x1={12} y1={4} x2={12} y2={20} />
      <Line x1={18} y1={4} x2={18} y2={20} />
      <Line x1={6} y1={12} x2={18} y2={12} />
      <Circle cx={6} cy={4} r={1.4} />
      <Circle cx={12} cy={4} r={1.4} />
      <Circle cx={18} cy={4} r={1.4} />
    </Svg>
  );
}
function BodyIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d={"M3.5 15.5v-3.2l2-4.6A2 2 0 017.3 6.5h9.4a2 2 0 011.8 1.2l2 4.6v3.2"} />
      <Line x1={3.5} y1={12.5} x2={20.5} y2={12.5} />
      <Circle cx={7.5} cy={16.5} r={2} />
      <Circle cx={16.5} cy={16.5} r={2} />
    </Svg>
  );
}
function BudgetIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} />
      <Path d={"M14.8 9a3.6 3.6 0 100 6"} />
      <Line x1={8} y1={10.8} x2={13.4} y2={10.8} />
      <Line x1={8} y1={13.2} x2={13.4} y2={13.2} />
    </Svg>
  );
}
function CountryIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} />
      <Line x1={3} y1={12} x2={21} y2={12} />
      <Path d={"M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"} />
    </Svg>
  );
}
function SearchIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={10.5} cy={10.5} r={6.5} />
      <Line x1={15.3} y1={15.3} x2={20.5} y2={20.5} />
    </Svg>
  );
}
function RangeIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d={"M3.5 17a8.5 8.5 0 1117 0"} />
      <Line x1={12} y1={17} x2={16} y2={11.5} />
      <Circle cx={12} cy={17} r={1.2} />
    </Svg>
  );
}
function ColorIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={9} cy={9.2} r={4.6} />
      <Circle cx={15} cy={9.2} r={4.6} />
      <Circle cx={12} cy={15} r={4.6} />
    </Svg>
  );
}
function YearIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d={"M4 6.5h16v13H4z M4 10.5h16 M8 4v4 M16 4v4"} />
    </Svg>
  );
}
function SeatsIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={3.8} />
      <Path d={"M4.5 20.5c0-4.1 3.4-7.2 7.5-7.2s7.5 3.1 7.5 7.2"} />
    </Svg>
  );
}
function BootIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3.5} y={8} width={17} height={12.5} rx={3} />
      <Path d={"M9 8V6.5A2 2 0 0111 4.5h2a2 2 0 012 2V8"} />
      <Line x1={3.5} y1={13.2} x2={20.5} y2={13.2} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  screenContent: { paddingBottom: 110 },
  scrollArea: { flex: 1, position: "relative" },
  scrollFade: { position: "absolute", top: 0, left: 0, right: 0, height: 18 },

  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  logoTile: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: fonts.bold, fontSize: 15, color: "#fff", letterSpacing: -0.3 },
  euroPill: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  euroPillText: { fontFamily: fonts.medium, fontSize: 10, color: "rgba(255,255,255,0.6)" },

  section: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },

  filtersHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 10 },
  filtersTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  filtersSubtitle: { fontFamily: fonts.regular, fontSize: 11, color: colors.mid, marginTop: 2 },
  clearBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  clearBtnText: { fontFamily: fonts.medium, fontSize: 11, color: colors.mid },

  filterGroups: { gap: 10 },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  wrapRowSm: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  rowGap: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  helperText: { fontFamily: fonts.regular, fontSize: 12, color: colors.mid, marginBottom: 10 },

  transPill: { paddingVertical: 10, paddingHorizontal: 20 },
  transLabel: { fontFamily: fonts.semibold, fontSize: 13 },

  countryPill: { paddingVertical: 6, paddingHorizontal: 12, gap: 6 },
  countryFlag: { fontSize: 14 },
  countryLabel: { fontFamily: fonts.semibold, fontSize: 12 },

  selectAllBtn: { borderRadius: radius.full, borderWidth: 1, borderStyle: "dashed", borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  selectAllText: { fontFamily: fonts.regular, fontSize: 11, color: colors.mid },

  sliderHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sliderValue: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  singleSlider: { width: "100%", height: 26 },
  scaleRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  scaleText: { fontFamily: fonts.medium, fontSize: 10, color: colors.mid },

  colorPill: { paddingVertical: 8, paddingHorizontal: 12 },
  colorPillInner: { alignItems: "center", gap: 6 },
  colorSwatch: { width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
  colorLabel: { fontFamily: fonts.semibold, fontSize: 11 },

  seatPill: { paddingVertical: 7, paddingHorizontal: 16 },
  seatLabel: { fontFamily: fonts.semibold, fontSize: 13 },

  valueRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  valueText: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  toText: { fontFamily: fonts.medium, fontSize: 11, color: colors.mid },

  ctaRow: { alignItems: "flex-start", gap: 10, marginTop: 22 },
  ctaBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 16, paddingHorizontal: 30, borderRadius: radius.md },
  ctaText: { fontFamily: fonts.bold, fontSize: 15, color: "#fff" },
  ctaHint: { fontFamily: fonts.regular, fontSize: 12, color: colors.mid },
});
