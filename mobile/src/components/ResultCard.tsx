// Ported from web/src/components/ResultCard.tsx — hover state becomes press feedback via
// Pressable's onPressIn/onPressOut (no hover concept on touch devices).
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { bestListing, fmt } from "../lib/scoring";
import { useFavorites } from "../lib/useFavorites";
import type { CarModel } from "../lib/types";
import { colors, fonts, radius, shadow } from "../lib/theme";
import { RankBadge } from "./RankBadge";
import { ScoreBadge } from "./ScoreBadge";
import { FUEL_ICONS } from "./icons";

export function ResultCard({
  car,
  rank,
  score,
  onPress,
}: {
  car: CarModel;
  rank: number;
  score: number;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(car.id);
  const best = bestListing(car);
  const fuelIcon = FUEL_ICONS[car.fuel];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.card,
        pressed ? shadow.cardLg : shadow.card,
        { borderColor: pressed ? colors.grad2 : colors.border },
      ]}
    >
      <View style={styles.rankCol}>
        <RankBadge rank={rank} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {car.brand} {car.name}
        </Text>
        {car.badge && (
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{car.badge}</Text>
            </View>
          </View>
        )}
        <View style={styles.metaRow}>
          {fuelIcon && (
            <View style={styles.metaItem}>
              {fuelIcon(colors.mid)}
              <Text style={styles.metaText}>{car.fuel}</Text>
            </View>
          )}
          <Text style={styles.metaText}>{car.type}</Text>
          <Text style={styles.metaText}>{car.range_km} km</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>from €{fmt(best.price)}</Text>
          <View style={styles.listingsPill}>
            <Text style={styles.listingsPillText}>{car.listings.length} listings</Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => toggleFavorite(car.id)}
        hitSlop={8}
        style={styles.favBtn}
        accessibilityLabel={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Svg width={17} height={17} viewBox="0 0 20 20" fill={favorite ? colors.accent : "none"}>
          <Path
            d="M10 17.2s-6.6-4-6.6-8.9A3.8 3.8 0 0110 5.9a3.8 3.8 0 016.6 2.4c0 4.9-6.6 8.9-6.6 8.9z"
            stroke={favorite ? colors.accent : colors.mid}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <ScoreBadge score={score} size={52} />
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ opacity: pressed ? 1 : 0.3 }}>
        <Path d="M5 3l4 4-4 4" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: 12,
  },
  rankCol: { width: 26, flexShrink: 0 },
  favBtn: { flexShrink: 0, alignItems: "center", justifyContent: "center", width: 28, height: 28 },
  info: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, alignSelf: "stretch" },
  badgeRow: { flexDirection: "row", marginTop: 3 },
  badge: {
    backgroundColor: colors.accentLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontFamily: fonts.semibold, fontSize: 9, color: colors.accent, textTransform: "uppercase", letterSpacing: 0.5 },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 5 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: fonts.regular, fontSize: 11, color: colors.mid },
  priceRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 6 },
  price: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  listingsPill: {
    backgroundColor: colors.bg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  listingsPillText: { fontFamily: fonts.medium, fontSize: 10, color: colors.mid },
});
