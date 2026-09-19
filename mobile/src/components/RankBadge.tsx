// Ported from web/src/components/RankBadge.tsx — gold/silver/bronze medallion for top 3.
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../lib/theme";

const RANK_GRADIENTS: Record<number, [string, string, string]> = {
  1: ["#ffe9b8", "#f0a93d", "#c9781a"],
  2: ["#f3f6fb", "#b9c3d4", "#8592a6"],
  3: ["#f0c9a4", "#c98652", "#93582c"],
};

export function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <View style={styles.plainWrap}>
        <Text style={styles.plainText}>#{rank}</Text>
      </View>
    );
  }
  return (
    <LinearGradient
      colors={RANK_GRADIENTS[rank]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.badge}
    >
      <Text style={styles.badgeText}>{rank}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  plainWrap: { width: "100%", alignItems: "center" },
  plainText: { fontFamily: fonts.bold, fontSize: 14, color: colors.mid },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 13, color: "#fff" },
});
