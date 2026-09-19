// Extracted from the old always-visible HomeScreen "How to use RankAutos" strip.
// Now shown in Onboarding (slide 2) and on the Profile > Help screen.
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "../../lib/theme";

const STEPS = [
  { n: "1", title: "Set your filters", desc: "Choose fuel type, body style, budget, and more" },
  { n: "2", title: "See the rankings", desc: "Every car scored 1–10 by your priorities, ranked best-first" },
  { n: "3", title: "Open the best ad", desc: "One tap takes you to the listing on the original platform" },
];

export function HowToUseSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>How to use RankAutos</Text>
      <View style={styles.stepsList}>
        {STEPS.map((s) => (
          <View key={s.n} style={styles.stepCard}>
            <View style={styles.stepTileWrap}>
              <LinearGradient colors={["#f1e9fd", "#fbe7f8"]} style={styles.stepTile}>
                <Text style={styles.stepTileNum}>{s.n}</Text>
              </LinearGradient>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: colors.mid, marginBottom: 20, textAlign: "center" },
  stepsList: { gap: 14 },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 16,
  },
  stepTileWrap: { flexShrink: 0 },
  stepTile: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#eee0fb" },
  stepTileNum: { fontFamily: fonts.bold, fontSize: 20, color: colors.grad2 },
  stepText: { flex: 1 },
  stepTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 3 },
  stepDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.mid, lineHeight: 18 },
});
