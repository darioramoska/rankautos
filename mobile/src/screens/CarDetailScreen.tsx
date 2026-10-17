// Ported from web/src/components/CarDetailModal.tsx. On web this was a bottom-sheet-style
// overlay <div> with a click-outside-to-close backdrop; here it's a real Expo Router route
// presented with `presentation: 'modal'` (see app/car-detail.tsx), so the OS/navigator supplies
// the sheet chrome and swipe-to-dismiss — we just render the content + an explicit close button.
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { CRITERIA } from "../lib/data";
import { bestListing, chargingApplies, criterionScore, fmt, scoreColor } from "../lib/scoring";
import { useWeights } from "../lib/useWeights";
import type { CarModel } from "../lib/types";
import { colors, fonts, radius } from "../lib/theme";
import { CarImage } from "../components/CarImage";
import { ScoreBadge } from "../components/ScoreBadge";
import { ListingsTable } from "../components/ListingsTable";
import { FUEL_ICONS } from "../components/icons";

export function CarDetailScreen({
  car,
  platformFilter,
  onClose,
  onOpenPlatform,
}: {
  car: CarModel;
  platformFilter: string[];
  onClose: () => void;
  onOpenPlatform: (platform: { name: string; url: string; flag: string }) => void;
}) {
  const { weights } = useWeights();
  const applies = chargingApplies(car);
  const score = React.useMemo(() => {
    let totalW = 0;
    let sum = 0;
    for (const c of CRITERIA) {
      if (c.key === "charging" && !applies) continue;
      const w = weights[c.key] || 0;
      totalW += w;
      sum += criterionScore(car, c.key) * w;
    }
    if (!totalW) return 0;
    return Math.round((sum / totalW) * 10) / 10;
  }, [car, weights, applies]);

  const fuelIcon = FUEL_ICONS[car.fuel];
  const best = bestListing(car);

  const stats = (
    car.fuel === "Hybrid" && car.elec_range_km
      ? [
          { l: "EV Range", v: `~${car.elec_range_km} km` },
          { l: "Fuel Range", v: `~${car.range_km - car.elec_range_km} km` },
        ]
      : [{ l: "Range", v: `${car.range_km} km` }]
  ).concat([
    { l: "Boot", v: `${car.boot_l} L` },
    { l: "Seats", v: String(car.seats) },
    { l: "NCAP", v: "★".repeat(car.ncap) },
    { l: car.charge_kw > 0 ? "DC Peak" : "Charging", v: car.charge_kw > 0 ? `${car.charge_kw} kW` : "N/A" },
    { l: "Gearbox", v: car.transmission || "Auto" },
  ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.metaRow}>
            {fuelIcon && fuelIcon(colors.mid)}
            <Text style={styles.metaText}>
              {car.fuel} · {car.type} · {car.year}
            </Text>
          </View>
          <Text style={styles.title}>
            {car.brand} {car.name}
          </Text>
          <Text style={styles.priceLine}>
            From <Text style={styles.priceStrong}>€{fmt(best.price)}</Text>
            <Text style={styles.msrp}>  · MSRP €{fmt(car.msrp)}</Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
          <ScoreBadge score={score} size={62} />
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <Path d="M2 2l10 10M12 2L2 12" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </View>
      </View>

      <View style={styles.imageWrap}>
        <CarImage car={car} w={260} h={146} />
      </View>

      <View style={styles.statGrid}>
        {stats.map((s) => (
          <View key={s.l} style={styles.statCell}>
            <Text style={styles.statValue}>{s.v}</Text>
            <Text style={styles.statLabel}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View style={styles.breakdown}>
        <Text style={styles.breakdownTitle}>Score Breakdown ({car.year} model)</Text>
        <View style={styles.breakdownList}>
          {CRITERIA.map((c) => {
            if (c.key === "charging" && !applies) {
              return (
                <View key={c.key}>
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: colors.mid }]}>{c.label}</Text>
                    <View style={styles.notWeighted}>
                      <Text style={styles.notWeightedText}>Electric / plug-in only</Text>
                    </View>
                  </View>
                  <View style={styles.barTrack} />
                </View>
              );
            }
            const raw = criterionScore(car, c.key);
            const w = weights[c.key] || 0;
            const col = scoreColor(raw);
            return (
              <View key={c.key}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{c.label}</Text>
                  <View style={styles.breakdownRight}>
                    {w === 0 && (
                      <View style={styles.notWeighted}>
                        <Text style={styles.notWeightedText}>not weighted</Text>
                      </View>
                    )}
                    <Text style={[styles.breakdownValue, { color: col }]}>{raw.toFixed(1)}</Text>
                  </View>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${raw * 10}%`, backgroundColor: col }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <ListingsTable car={car} weights={weights} platformFilter={platformFilter} onOpenPlatform={onOpenPlatform} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 20, paddingBottom: 48 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 10 },
  headerLeft: { flex: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  metaText: { fontFamily: fonts.semibold, fontSize: 11, textTransform: "uppercase", color: colors.mid, letterSpacing: 0.5 },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, letterSpacing: -0.5 },
  priceLine: { fontFamily: fonts.regular, fontSize: 13, color: colors.mid, marginTop: 4 },
  priceStrong: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  msrp: { fontFamily: fonts.regular, fontSize: 12, color: colors.mid },
  headerRight: { alignItems: "center", gap: 10 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },

  imageWrap: { backgroundColor: colors.bg, borderRadius: radius.md, padding: 20, alignItems: "center", marginBottom: 18 },

  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 22 },
  statCell: { backgroundColor: colors.bg, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 10, minWidth: 86, flexGrow: 1, alignItems: "center" },
  statValue: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  statLabel: { fontFamily: fonts.medium, fontSize: 9, textTransform: "uppercase", color: colors.mid, marginTop: 2, letterSpacing: 0.5 },

  breakdown: { marginBottom: 26 },
  breakdownTitle: { fontFamily: fonts.semibold, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: colors.mid, marginBottom: 12 },
  breakdownList: { gap: 10 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  breakdownLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  breakdownRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  notWeighted: { backgroundColor: colors.bg, borderRadius: radius.full, paddingHorizontal: 7, paddingVertical: 1 },
  notWeightedText: { fontFamily: fonts.regular, fontSize: 10, color: colors.mid },
  breakdownValue: { fontFamily: fonts.bold, fontSize: 13 },
  barTrack: { height: 5, borderRadius: 3, backgroundColor: colors.border, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
});
