// Ported from web/src/components/ResultsScreen.tsx. The web version renders the weight-slider
// sidebar and the ranked list side by side (desktop) via CSS grid, with CarDetailModal as an
// absolutely-positioned overlay. On mobile there's no room for a persistent sidebar, so weights
// live in a collapsible panel above the list — same live re-rank behavior (weights come from the
// same AsyncStorage-backed useWeights hook, watched by useMemo below), and tapping a result card
// pushes the Car Detail route instead of opening an in-page overlay.
import React, { useEffect, useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { CAR_DATA, CRITERIA, listingInMarkets } from "../lib/data";
import { getCars } from "../lib/getCars";
import { bestListing, modelWeightedScore } from "../lib/scoring";
import { useWeights } from "../lib/useWeights";
import { useFilters } from "../lib/useFilters";
import { colors, fonts, gradientBrand, gradientHero, radius, shadow } from "../lib/theme";
import type { CarModel } from "../lib/types";
import { GradientPill } from "../components/GradientPill";
import { WeightSlider } from "../components/WeightSlider";
import { ResultCard } from "../components/ResultCard";

type SortBy = "score" | "price";

export function ResultsScreen({
  onBack,
  onOpenCar,
}: {
  onBack: () => void;
  onOpenCar: (carId: number) => void;
}) {
  const { weights, setWeights, reset } = useWeights();
  const { filters } = useFilters();
  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [prioritiesOpen, setPrioritiesOpen] = useState(false);
  // Starts with the bundled mock catalog so the list renders immediately (no RN
  // equivalent of Next's server-side await), then swaps to live Supabase data once
  // it resolves — same fallback behavior as web's getCars(), just fetched client-side.
  const [cars, setCars] = useState<CarModel[]>(CAR_DATA);

  useEffect(() => {
    let cancelled = false;
    getCars().then((data) => {
      if (!cancelled) setCars(data);
    });
    return () => {
      cancelled = true;
    };
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
      if ((filters.countries || []).length && !car.listings.some((l) => listingInMarkets(l, filters.countries))) return false;
      if ((filters.colors || []).length && !car.listings.some((l) => filters.colors.includes(l.ext_color))) return false;
      return true;
    });
  }, [cars, filters, platformFilter]);

  const ranked = useMemo(() => {
    return filtered
      .map((car) => ({ car, score: modelWeightedScore(car, weights) }))
      .sort((a, b) => (sortBy === "score" ? b.score - a.score : bestListing(a.car).price - bestListing(b.car).price));
  }, [filtered, weights, sortBy]);

  return (
    <View style={styles.screen}>
      {/* Top bar — same hero gradient as Filters/Profile, for a consistent colour identity
          across every section instead of switching to plain white here. */}
      <LinearGradient colors={gradientHero} start={{ x: 0.05, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path d="M10 3L5 8l5 5" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.backText}>Filters</Text>
        </Pressable>
        <View style={styles.brandRow}>
          <LinearGradient colors={gradientBrand} style={styles.brandTile}>
            <Svg width={13} height={13} viewBox="0 0 18 18" fill="none">
              <Path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </LinearGradient>
          <Text style={styles.brandText}>RankAutos</Text>
        </View>
      </LinearGradient>

      <View style={styles.listArea}>
      <FlatList
        data={ranked}
        keyExtractor={(item) => String(item.car.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Step 2 — Your rankings</Text>
                <Text style={styles.headerSubtitle}>
                  {ranked.length} model{ranked.length !== 1 ? "s" : ""} match your filters
                </Text>
              </View>
            </View>

            <View style={styles.controlsRow}>
              <View style={styles.sortSeg}>
                {(["score", "price"] as const).map((s) => {
                  const active = sortBy === s;
                  return (
                    <GradientPill key={s} active={active} onPress={() => setSortBy(s)} borderRadius={radius.full} style={styles.sortSegBtn}>
                      <Text style={active ? styles.sortSegTextActive : styles.sortSegText}>Sort: {s}</Text>
                    </GradientPill>
                  );
                })}
              </View>
              <Pressable onPress={() => setPrioritiesOpen((o) => !o)} style={styles.prioritiesToggle}>
                <Text style={styles.prioritiesToggleText}>{prioritiesOpen ? "Hide priorities" : "Your priorities"}</Text>
              </Pressable>
            </View>

            {prioritiesOpen && (
              <View style={[styles.prioritiesPanel, shadow.card]}>
                <View style={styles.prioritiesHeader}>
                  <Text style={styles.prioritiesTitle}>Your priorities</Text>
                  <Pressable onPress={reset}>
                    <Text style={styles.resetText}>Reset</Text>
                  </Pressable>
                </View>
                <View style={styles.slidersCol}>
                  {CRITERIA.map((c) => (
                    <WeightSlider
                      key={c.key}
                      criterion={c}
                      value={weights[c.key]}
                      onChange={(v) => setWeights((w) => ({ ...w, [c.key]: v }))}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.cardWrap}>
            <ResultCard car={item.car} rank={index + 1} score={item.score} onPress={() => onOpenCar(item.car.id)} />
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.emptyBox, shadow.card]}>
            <Text style={styles.emptyText}>No cars match your filters.</Text>
            <Pressable onPress={onBack}>
              <Text style={styles.emptyLink}>Adjust filters</Text>
            </Pressable>
          </View>
        }
      />
      <LinearGradient colors={[colors.bg, colors.bg + "00"]} pointerEvents="none" style={styles.scrollFade} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { fontFamily: fonts.semibold, fontSize: 13, color: "rgba(255,255,255,0.7)" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandTile: { width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  brandText: { fontFamily: fonts.bold, fontSize: 13, color: "#fff" },

  listArea: { flex: 1, position: "relative" },
  scrollFade: { position: "absolute", top: 0, left: 0, right: 0, height: 16 },
  listContent: { padding: 20, paddingBottom: 24, gap: 8 },
  headerRow: { marginBottom: 14 },
  headerTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  headerSubtitle: { fontFamily: fonts.regular, fontSize: 11, color: colors.mid, marginTop: 2 },

  controlsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 8 },
  sortSeg: { flexDirection: "row", gap: 6 },
  sortSegBtn: { paddingVertical: 6, paddingHorizontal: 14 },
  sortSegText: { fontFamily: fonts.semibold, fontSize: 11, color: colors.mid, textTransform: "capitalize" },
  sortSegTextActive: { fontFamily: fonts.semibold, fontSize: 11, color: "#fff", textTransform: "capitalize" },
  prioritiesToggle: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingVertical: 6, paddingHorizontal: 12 },
  prioritiesToggleText: { fontFamily: fonts.semibold, fontSize: 11, color: colors.grad2 },

  prioritiesPanel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 18, marginBottom: 16 },
  prioritiesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  prioritiesTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  resetText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.grad2 },
  slidersCol: { gap: 16 },

  cardWrap: {},

  emptyBox: { alignItems: "center", padding: 40, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 6 },
  emptyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.mid },
  emptyLink: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grad2 },
});
