// Mobile counterpart of web/src/components/DashboardScreen.tsx: compact hero (logo, name,
// motto, key stats) pinned at the top that shrinks and fades as the favorites list scrolls
// underneath it. Driven by Animated scrollY interpolation instead of a CSS scroll listener.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { CAR_DATA } from "../lib/data";
import { getCars } from "../lib/getCars";
import { modelWeightedScore } from "../lib/scoring";
import { useFavorites } from "../lib/useFavorites";
import { useWeights } from "../lib/useWeights";
import type { CarModel } from "../lib/types";
import { colors, fonts, gradientBrand, gradientHero, radius } from "../lib/theme";
import { ResultCard } from "../components/ResultCard";

const HERO_MAX = 250;
const HERO_MIN = 104;
const COLLAPSE = HERO_MAX - HERO_MIN;

export function DashboardScreen({
  onOpenCar,
  onBrowse,
}: {
  onOpenCar: (carId: number) => void;
  onBrowse: () => void;
}) {
  const { favorites } = useFavorites();
  const { weights } = useWeights();
  const [cars, setCars] = useState<CarModel[]>(CAR_DATA);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    getCars().then((data) => {
      if (!cancelled) setCars(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const favoriteCars = useMemo(
    () =>
      cars
        .filter((c) => favorites.includes(c.id))
        .map((car) => ({ car, score: modelWeightedScore(car, weights) }))
        .sort((a, b) => b.score - a.score),
    [cars, favorites, weights]
  );

  const heroHeight = scrollY.interpolate({ inputRange: [0, COLLAPSE], outputRange: [HERO_MAX, HERO_MIN], extrapolate: "clamp" });
  const detailOpacity = scrollY.interpolate({ inputRange: [0, COLLAPSE * 0.6], outputRange: [1, 0], extrapolate: "clamp" });
  const logoScale = scrollY.interpolate({ inputRange: [0, COLLAPSE], outputRange: [1, 0.82], extrapolate: "clamp" });

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.heroWrap, { height: heroHeight }]}>
        <LinearGradient colors={gradientHero} start={{ x: 0.05, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.hero}>
          <Animated.View style={[styles.logoRow, { transform: [{ scale: logoScale }] }]}>
            <LinearGradient colors={gradientBrand} style={styles.logoTile}>
              <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
                <Path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </LinearGradient>
            <Text style={styles.logoText}>RankAutos</Text>
          </Animated.View>

          <Animated.View style={{ opacity: detailOpacity, alignItems: "center" }}>
            <View style={styles.motto}>
              <Text style={styles.mottoText}>One search. Every platform. Best price.</Text>
            </View>
            <View style={styles.statsRow}>
              {[
                [String(cars.length), "models"],
                ["7", "criteria"],
                ["Daily", "refresh"],
              ].map(([n, l]) => (
                <View key={l} style={styles.statItem}>
                  <Text style={styles.statNum}>{n}</Text>
                  <Text style={styles.statLabel}>{l}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.FlatList
        data={favoriteCars}
        keyExtractor={(item) => String(item.car.id)}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HERO_MAX + 18, paddingHorizontal: 20, paddingBottom: 130, gap: 8 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>Your favorites</Text>
            <Text style={styles.sectionSub}>
              {favoriteCars.length === 0
                ? "Tap the heart on any car in Rankings to save it here."
                : `${favoriteCars.length} car${favoriteCars.length !== 1 ? "s" : ""} saved`}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <ResultCard car={item.car} rank={index + 1} score={item.score} onPress={() => onOpenCar(item.car.id)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No favorites yet.</Text>
            <Pressable onPress={onBrowse}>
              <Text style={styles.emptyLink}>Browse rankings</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  heroWrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, overflow: "hidden" },
  hero: { flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 22, paddingHorizontal: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  logoTile: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: fonts.bold, fontSize: 19, color: "#fff", letterSpacing: -0.3 },
  motto: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 14,
  },
  mottoText: { fontFamily: fonts.semibold, fontSize: 10.5, color: "#f3d9fb", letterSpacing: 1.5, textTransform: "uppercase" },
  statsRow: { flexDirection: "row", gap: 26 },
  statItem: { alignItems: "center" },
  statNum: { fontFamily: fonts.bold, fontSize: 19, color: "#f6b6ff" },
  statLabel: { fontFamily: fonts.medium, fontSize: 9, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  sectionSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.mid, marginTop: 2 },
  emptyBox: {
    alignItems: "center",
    padding: 40,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    gap: 6,
  },
  emptyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.mid },
  emptyLink: { fontFamily: fonts.semibold, fontSize: 13, color: colors.grad2 },
});
