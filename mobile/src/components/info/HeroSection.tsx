// Extracted from the old always-visible HomeScreen hero block. Used by Onboarding
// (slide 1) only now. Fills the full slide height and centers everything — the
// parent slide wrapper in Onboarding.tsx gives it flex:1 to fill.
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, fonts, gradientBrand, gradientHero, gradientWarmBlob, radius } from "../../lib/theme";
import { CAR_DATA, PLATFORMS } from "../../lib/data";

export function HeroSection() {
  const modelCount = CAR_DATA.length;
  const platformCount = PLATFORMS.length;

  return (
    <LinearGradient colors={gradientHero} start={{ x: 0.05, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.hero}>
      <LinearGradient colors={gradientWarmBlob} style={styles.blob} />
      <View style={styles.content}>
        <View style={styles.logoRow}>
          <LinearGradient colors={gradientBrand} style={styles.logoTile}>
            <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
              <Path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </LinearGradient>
          <Text style={styles.logoText}>RankAutos</Text>
          <View style={styles.euroPill}>
            <Text style={styles.euroPillText}>Pan-European</Text>
          </View>
        </View>

        <BlurView intensity={30} tint="light" style={styles.taglineBlur}>
          <Text style={styles.taglineText}>One search. Every platform. Best price.</Text>
        </BlurView>

        <Text style={styles.h1}>
          See all car ads in one place —{"\n"}
          <Text style={styles.h1Accent}>ranked to find your dream car.</Text>
        </Text>
        <Text style={styles.heroSub}>
          We scan AutoScout24, mobile.de, and {platformCount - 2} other EU platforms daily, score every listing across 7
          criteria, and rank them by what matters to you.
        </Text>

        <View style={styles.statsRow}>
          {[
            [String(modelCount), "models"],
            ["7", "criteria"],
            [String(platformCount), "EU platforms"],
            ["Daily", "refresh"],
          ].map(([n, l]) => (
            <View key={l} style={styles.statItem}>
              <Text style={styles.statNum}>{n}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, paddingHorizontal: 28, paddingVertical: 60, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  blob: { position: "absolute", width: 320, height: 320, borderRadius: 160, right: -100, bottom: -160, opacity: 0.5 },
  content: { alignItems: "center", maxWidth: 420 },
  logoRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 },
  logoTile: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: fonts.bold, fontSize: 17, color: "#fff", letterSpacing: -0.3 },
  euroPill: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  euroPillText: { fontFamily: fonts.medium, fontSize: 10, color: "rgba(255,255,255,0.6)" },
  taglineBlur: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: 18,
  },
  taglineText: { fontFamily: fonts.semibold, fontSize: 11, color: "#f3d9fb", letterSpacing: 1.5, textTransform: "uppercase" },
  h1: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 33, color: "#fff", letterSpacing: -0.5, textAlign: "center" },
  h1Accent: { color: "#f6b6ff" },
  heroSub: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: "rgba(255,255,255,0.55)", marginTop: 16, textAlign: "center" },
  statsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 22, marginTop: 28 },
  statItem: { alignItems: "center" },
  statNum: { fontFamily: fonts.bold, fontSize: 19, color: "#f6b6ff" },
  statLabel: { fontFamily: fonts.medium, fontSize: 10, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginTop: 2 },
});
