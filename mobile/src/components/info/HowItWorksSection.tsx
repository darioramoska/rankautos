// Extracted from the old always-visible HomeScreen "How it works" diagram.
// Now shown in Onboarding (slide 3) and on the Profile > Help screen. Stacked
// top-to-bottom (was a horizontal ScrollView) so nothing requires side-scrolling.
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, gradientBrand, radius } from "../../lib/theme";

const HOW_PLATFORMS = [
  { flag: "🇪🇺", name: "AutoScout24" },
  { flag: "🇩🇪", name: "mobile.de" },
  { flag: "🇫🇷", name: "LaCentrale" },
  { flag: "🇳🇱", name: "Marktplaats" },
  { flag: "🇵🇱", name: "Otomoto" },
];

const HOW_RESULTS = [
  { r: "#1", n: "Ioniq 5", s: "9.2" },
  { r: "#2", n: "Model Y", s: "8.8" },
  { r: "#3", n: "Enyaq 85", s: "8.5" },
];

function Connector({ label }: { label: string }) {
  return (
    <View style={styles.connector}>
      <Text style={styles.connectorArrow}>↓</Text>
      <View style={styles.connectorTag}>
        <Text style={styles.connectorTagText}>{label}</Text>
      </View>
    </View>
  );
}

export function HowItWorksSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>How it works</Text>

      <View style={styles.howCol}>
        <View style={styles.howPlatforms}>
          {HOW_PLATFORMS.map((p) => (
            <View key={p.name} style={styles.howPlatformRow}>
              <Text style={styles.howPlatformText}>
                {p.flag} {p.name}
              </Text>
            </View>
          ))}
          <View style={styles.howPlatformMore}>
            <Text style={styles.howPlatformMoreText}>+ 5 more platforms</Text>
          </View>
        </View>

        <Connector label="daily scan" />

        <LinearGradient colors={gradientBrand} style={styles.howBox}>
          <Text style={styles.howBoxTitle}>RankAutos</Text>
          <Text style={styles.howBoxSubtitle}>scores &amp; ranks</Text>
          <View style={styles.howBoxChips}>
            {["Range", "Safety", "Value", "Tech", "Reliability"].map((c) => (
              <View key={c} style={styles.howBoxChip}>
                <Text style={styles.howBoxChipText}>{c}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <Connector label="ranked list" />

        <View style={styles.howResults}>
          {HOW_RESULTS.map((c) => (
            <View key={c.r} style={styles.howResultRow}>
              <Text style={styles.howResultRank}>{c.r}</Text>
              <Text style={styles.howResultName}>{c.n}</Text>
              <Text style={styles.howResultScore}>{c.s}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: colors.mid, marginBottom: 20, textAlign: "center" },
  howCol: { alignItems: "stretch" },
  howPlatforms: { gap: 6 },
  howPlatformRow: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12 },
  howPlatformText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  howPlatformMore: { borderWidth: 1, borderStyle: "dashed", borderColor: colors.border, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12 },
  howPlatformMoreText: { fontFamily: fonts.regular, fontSize: 12, color: colors.mid, fontStyle: "italic", textAlign: "center" },
  connector: { alignItems: "center", gap: 6, paddingVertical: 8 },
  connectorArrow: { fontSize: 18, color: colors.border, fontFamily: fonts.bold },
  connectorTag: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  connectorTagText: { fontFamily: fonts.bold, fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: colors.mid },
  howBox: { borderRadius: 16, paddingVertical: 18, paddingHorizontal: 18, alignItems: "center" },
  howBoxTitle: { fontFamily: fonts.bold, fontSize: 15, color: "#fff" },
  howBoxSubtitle: { fontFamily: fonts.regular, fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2, letterSpacing: 0.5 },
  howBoxChips: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 4, marginTop: 11 },
  howBoxChip: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3 },
  howBoxChipText: { fontFamily: fonts.regular, fontSize: 9, color: "rgba(255,255,255,0.8)" },
  howResults: { gap: 6 },
  howResultRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12 },
  howResultRank: { fontFamily: fonts.bold, fontSize: 11, color: colors.mid, width: 20 },
  howResultName: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, flex: 1 },
  howResultScore: { fontFamily: fonts.bold, fontSize: 13, color: colors.green },
});
