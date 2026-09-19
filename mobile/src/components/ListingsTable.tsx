// Ported from web/src/components/ListingsTable.tsx — listings grouped by platform, best score
// first. Web opened a <PlatformModal> overlay on row click; here the Platform Listings screen is
// a real route (modal presentation), so this component just calls `onOpenPlatform` and the
// screen (app/car-detail.tsx) does the router.push.
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { fmt, listingWeightedScore } from "../lib/scoring";
import type { CarModel, Listing, Weights } from "../lib/types";
import { colors, fonts, radius } from "../lib/theme";
import { ScoreBadge } from "./ScoreBadge";

type PlatformSummary = { name: string; url: string; flag: string };
type GroupedRow = { best: Listing & { lScore: number }; count: number; platform: PlatformSummary };

export function ListingsTable({
  car,
  weights,
  platformFilter,
  onOpenPlatform,
}: {
  car: CarModel;
  weights: Weights;
  platformFilter: string[];
  onOpenPlatform: (platform: PlatformSummary) => void;
}) {
  const grouped = useMemo<GroupedRow[]>(() => {
    const filtered = car.listings
      .filter((l) => !platformFilter.length || platformFilter.includes(l.name))
      .map((l) => ({ ...l, lScore: listingWeightedScore(car, l, weights) }));
    const map: Record<string, (Listing & { lScore: number })[]> = {};
    filtered.forEach((l) => {
      if (!map[l.name]) map[l.name] = [];
      map[l.name].push(l);
    });
    return Object.values(map)
      .map((group) => ({
        best: [...group].sort((a, b) => b.lScore - a.lScore)[0],
        count: group.length,
        platform: { name: group[0].name, url: group[0].url, flag: group[0].flag },
      }))
      .sort((a, b) => b.best.lScore - a.best.lScore);
  }, [car, weights, platformFilter]);

  if (!grouped.length) {
    return <Text style={styles.empty}>No listings from selected platforms.</Text>;
  }

  return (
    <View>
      <Text style={styles.sectionLabel}>
        Live Listings — {car.listings.length} total across {grouped.length} platform{grouped.length !== 1 ? "s" : ""} ·
        tap row to expand
      </Text>
      <View style={styles.rows}>
        {grouped.map(({ best: l, count, platform }, i) => {
          const isBest = i === 0;
          return (
            <Pressable
              key={l.id}
              onPress={() => onOpenPlatform(platform)}
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
                  {count > 1 && (
                    <View style={[styles.countPill, { backgroundColor: isBest ? "rgba(255,255,255,0.2)" : colors.border }]}>
                      <Text style={[styles.countPillText, { color: isBest ? "rgba(255,255,255,0.85)" : colors.mid }]}>{count}</Text>
                    </View>
                  )}
                </View>
                <Svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ opacity: 0.6 }}>
                  <Path d="M2 4l4 4 4-4" stroke={isBest ? "#fff" : colors.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
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
                <Text style={[styles.price, { color: isBest ? "#fff" : colors.ink }]}>€{fmt(l.price)}</Text>
                <ScoreBadge score={l.lScore} size={40} />
              </View>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.footnote}>
        Refreshed daily · Scores adjust for year &amp; mileage · Tap a row to see all listings from that platform
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontFamily: fonts.regular, fontSize: 13, color: colors.mid, paddingVertical: 12 },
  sectionLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.mid,
    marginBottom: 12,
  },
  rows: { gap: 8 },
  row: { borderRadius: 12, borderWidth: 1, padding: 12, gap: 6 },
  rowTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowTopLeft: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  bestTag: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: radius.full, paddingHorizontal: 5, paddingVertical: 1 },
  bestTagText: { fontFamily: fonts.bold, fontSize: 9, color: "#fff" },
  platformName: { fontFamily: fonts.bold, fontSize: 12, flexShrink: 1 },
  countPill: { borderRadius: radius.full, paddingHorizontal: 6, paddingVertical: 1 },
  countPillText: { fontFamily: fonts.semibold, fontSize: 10 },
  rowBottom: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  metaText: { fontFamily: fonts.regular, fontSize: 11, flexShrink: 1 },
  rowFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontFamily: fonts.bold, fontSize: 14 },
  footnote: { fontFamily: fonts.regular, fontSize: 11, color: colors.mid, marginTop: 10 },
});
