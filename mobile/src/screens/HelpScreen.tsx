// Mirrors web/src/app/help/page.tsx.
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, fonts } from "../lib/theme";
import { HowToUseSection } from "../components/info/HowToUseSection";
import { HowItWorksSection } from "../components/info/HowItWorksSection";

export function HelpScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path d="M10 3L5 8l5 5" stroke={colors.mid} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.backText}>Profile</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>Help</Text>
      <HowToUseSection />
      <HowItWorksSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.mid },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink, paddingHorizontal: 20, paddingTop: 20 },
});
