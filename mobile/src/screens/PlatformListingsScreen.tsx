// Ported from web/src/components/PlatformModal.tsx — paginated table of all listings for one
// car+platform, with condition/max-km/min-year filters. Row tap opens the listing URL in the
// device browser (Linking.openURL) instead of a web <a target="_blank">.
import React, { useMemo, useState } from "react";
import Slider from "@react-native-assets/slider";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { fmt, listingWeightedScore } from "../lib/scoring";
import type { CarModel, Weights } from "../lib/types";
import { colors, fonts, radius } from "../lib/theme";
import { GradientPill } from "../components/GradientPill";
import { ScoreBadge } from "../components/ScoreBadge";

const PER_PAGE = 10;

export function PlatformListingsScreen({
  car,
  platform,
  weights,
  onClose,
}: {
  car: CarModel;
  platform: { name: string; url: string; flag: string };
  weights: Weights;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [condFilter, setCondFilter] = useState<"All" | "New" | "Used">("All");
  const [maxKm, setMaxKm] = useState(200000);
  const [minYear, setMinYear] = useState(2015);

  const allListings = useMemo(() => {
    return car.listings
      .filter((l) => l.name === platform.name)
      .filter((l) => condFilter === "All" || l.condition === condFilter)
      .filter((l) => l.mileage <= maxKm)
      .filter((l) => l.year >= minYear)
      .map((l) => ({ ...l, lScore: listingWeightedScore(car, l, weights) }))
      .sort((a, b) => b.lScore - a.lScore);
  }, [car, platform, weights, condFilter, maxKm, minYear]);

  const pages = Math.max(1, Math.ceil(allListings.length / PER_PAGE));
  const visible = allListings.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>
            {platform.flag} {platform.name} · {car.brand} {car.name}
          </Text>
          <Text style={styles.headerTitle}>
            {allListings.length} listing{allListings.length !== 1 ? "s" : ""} found
          </Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
            <Path d="M1 1l11 11M12 1L1 12" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>

      <View style={styles.filters}>
        <View style={styles.condRow}>
          <Text style={styles.filterLabel}>Condition</Text>
          <View style={styles.condChips}>
            {(["All", "New", "Used"] as const).map((c) => {
              const active = condFilter === c;
              return (
                <GradientPill
                  key={c}
                  active={active}
                  onPress={() => {
                    setCondFilter(c);
                    setPage(0);
                  }}
                  style={styles.condChip}
                >
                  <Text style={[styles.condChipText, { color: active ? "#fff" : colors.mid }]}>{c}</Text>
                </GradientPill>
              );
            })}
          </View>
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.filterLabel}>
            Max km: <Text style={styles.filterLabelStrong}>{fmt(maxKm)}</Text>
          </Text>
          <Slider
            value={maxKm}
            minimumValue={0}
            maximumValue={200000}
            step={5000}
            minimumTrackTintColor={colors.grad2}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.grad3}
            trackHeight={4}
            thumbSize={16}
            style={styles.slider}
            onValueChange={(v) => {
              setMaxKm(v);
              setPage(0);
            }}
          />
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.filterLabel}>
            From: <Text style={styles.filterLabelStrong}>{minYear}</Text>
          </Text>
          <Slider
            value={minYear}
            minimumValue={2015}
            maximumValue={2025}
            step={1}
            minimumTrackTintColor={colors.grad2}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.grad3}
            trackHeight={4}
            thumbSize={16}
            style={styles.slider}
            onValueChange={(v) => {
              setMinYear(v);
              setPage(0);
            }}
          />
        </View>
      </View>

      <ScrollView style={styles.rowsScroll} contentContainerStyle={styles.rowsContent}>
        {visible.length === 0 ? (
          <Text style={styles.noMatch}>No listings match filters</Text>
        ) : (
          visible.map((l, i) => {
            const isBest = i === 0 && page === 0;
            return (
              <Pressable
                key={l.id}
                onPress={() => Linking.openURL(l.url).catch(() => {})}
                style={[styles.row, { backgroundColor: isBest ? colors.grad2 : colors.bg, borderColor: isBest ? "transparent" : colors.border }]}
              >
                <View style={styles.rowTop}>
                  <View style={styles.rowTopLeft}>
                    {isBest && (
                      <View style={styles.bestTag}>
                        <Text style={styles.bestTagText}>Best</Text>
                      </View>
                    )}
                    <Text style={[styles.platformName, { color: isBest ? "#fff" : colors.ink }]} numberOfLines={1}>
                      {l.flag} {l.name}
                    </Text>
                  </View>
                  <Text style={[styles.price, { color: isBest ? "#fff" : colors.ink }]}>€{fmt(l.price)}</Text>
                </View>
                <View style={styles.rowBottom}>
                  <Text style={[styles.metaText, { color: isBest ? "rgba(255,255,255,0.8)" : colors.mid }]}>
                    {l.year} · {l.mileage === 0 ? "New" : `${fmt(l.mileage)} km`} · {l.condition}
                  </Text>
                  <Text style={[styles.metaText, { color: isBest ? "rgba(255,255,255,0.8)" : colors.mid }]} numberOfLines={1}>
                    {l.location}
                  </Text>
                </View>
                <View style={styles.rowFooter}>
                  <ScoreBadge score={l.lScore} size={36} />
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {pages > 1 && (
        <View style={styles.pagination}>
          <Pressable onPress={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={styles.pageArrow}>
            <Text style={[styles.pageArrowText, { opacity: page === 0 ? 0.4 : 1 }]}>←</Text>
          </Pressable>
          {Array.from({ length: pages }, (_, i) => i).map((i) => (
            <GradientPill key={i} active={page === i} onPress={() => setPage(i)} borderRadius={10} style={styles.pageNum}>
              <Text style={[styles.pageNumText, { color: page === i ? "#fff" : colors.mid }]}>{i + 1}</Text>
            </GradientPill>
          ))}
          <Pressable onPress={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} style={styles.pageArrow}>
            <Text style={[styles.pageArrowText, { opacity: page === pages - 1 ? 0.4 : 1 }]}>→</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerEyebrow: { fontFamily: fonts.regular, fontSize: 11, color: colors.mid, marginBottom: 4 },
  headerTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },

  filters: { padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.bg },
  condRow: { gap: 8 },
  filterLabel: { fontFamily: fonts.semibold, fontSize: 11, textTransform: "uppercase", color: colors.mid, letterSpacing: 0.5 },
  filterLabelStrong: { fontFamily: fonts.bold, color: colors.ink, textTransform: "none" },
  condChips: { flexDirection: "row", gap: 6 },
  condChip: { paddingVertical: 4, paddingHorizontal: 10 },
  condChipText: { fontFamily: fonts.semibold, fontSize: 12 },
  sliderRow: { gap: 4 },
  slider: { width: "100%", height: 24 },

  rowsScroll: { flex: 1 },
  rowsContent: { padding: 16, gap: 8 },
  noMatch: { textAlign: "center", padding: 40, color: colors.mid, fontFamily: fonts.regular, fontSize: 14 },
  row: { borderRadius: 12, borderWidth: 1, padding: 12, gap: 6 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowTopLeft: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  bestTag: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: radius.full, paddingHorizontal: 5, paddingVertical: 1 },
  bestTagText: { fontFamily: fonts.bold, fontSize: 9, color: "#fff" },
  platformName: { fontFamily: fonts.semibold, fontSize: 12, flexShrink: 1 },
  price: { fontFamily: fonts.bold, fontSize: 13 },
  rowBottom: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  metaText: { fontFamily: fonts.regular, fontSize: 11, flexShrink: 1 },
  rowFooter: { flexDirection: "row", justifyContent: "flex-end" },

  pagination: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  pageArrow: { paddingHorizontal: 12, paddingVertical: 6 },
  pageArrowText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.mid },
  pageNum: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  pageNumText: { fontFamily: fonts.bold, fontSize: 13 },
});
