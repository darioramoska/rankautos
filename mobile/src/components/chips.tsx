// Ported from web/src/components/chips.tsx — BodyChip, FuelChip, PlatformChip.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { BodyType, Fuel, Platform } from "../lib/types";
import { colors, fonts } from "../lib/theme";
import { GradientPill } from "./GradientPill";
import { BODY_SVGS, FUEL_ICONS } from "./icons";

export function BodyChip({ type, active, onClick }: { type: BodyType; active: boolean; onClick: () => void }) {
  const Svg = BODY_SVGS[type];
  const c = active ? "#fff" : colors.mid;
  return (
    <GradientPill active={active} onPress={onClick} borderRadius={16} style={styles.bodyChip}>
      <View style={styles.bodyChipInner}>
        {Svg(c)}
        <Text style={[styles.bodyLabel, { color: c }]}>{type}</Text>
      </View>
    </GradientPill>
  );
}

export function FuelChip({ fuel, active, onClick }: { fuel: Fuel; active: boolean; onClick: () => void }) {
  const Icon = FUEL_ICONS[fuel];
  const c = active ? "#fff" : colors.mid;
  return (
    <GradientPill active={active} onPress={onClick} style={styles.fuelChip}>
      {Icon(c)}
      <Text style={[styles.fuelLabel, { color: c }]}>{fuel}</Text>
    </GradientPill>
  );
}

export function PlatformChip({ platform, active, onClick }: { platform: Platform; active: boolean; onClick: () => void }) {
  return (
    <GradientPill active={active} onPress={onClick} style={styles.platformChip}>
      <Text style={styles.platformFlag}>{platform.flag}</Text>
      <Text style={[styles.platformLabel, { color: active ? "#fff" : colors.mid }]}>{platform.label}</Text>
    </GradientPill>
  );
}

const styles = StyleSheet.create({
  bodyChip: { minWidth: 90, paddingVertical: 10, paddingHorizontal: 12 },
  bodyChipInner: { alignItems: "center", gap: 5 },
  bodyLabel: { fontFamily: fonts.semibold, fontSize: 11 },
  fuelChip: { paddingVertical: 8, paddingHorizontal: 14, gap: 7 },
  fuelLabel: { fontFamily: fonts.semibold, fontSize: 13 },
  platformChip: { paddingVertical: 6, paddingHorizontal: 12, gap: 6 },
  platformFlag: { fontSize: 14 },
  platformLabel: { fontFamily: fonts.semibold, fontSize: 12 },
});
