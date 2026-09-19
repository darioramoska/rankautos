// Ported from web/src/components/BudgetRange.tsx — presets row + dual-thumb slider.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fmt } from "../lib/scoring";
import { colors, fonts } from "../lib/theme";
import { DualRangeSlider } from "./DualRangeSlider";
import { GradientPill } from "./GradientPill";

const BUDGET_MIN = 0;
const BUDGET_MAX = 80000;
const BUDGET_STEP = 2500;

const PRESETS = [
  { label: "Any", mn: 0, mx: 80000 },
  { label: "Under €25k", mn: 0, mx: 25000 },
  { label: "€25–40k", mn: 25000, mx: 40000 },
  { label: "€40–60k", mn: 40000, mx: 60000 },
  { label: "€60k+", mn: 60000, mx: 80000 },
];

export function BudgetRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const activePreset = PRESETS.find((p) => p.mn === min && p.mx === max);

  return (
    <View>
      <View style={styles.presetRow}>
        {PRESETS.map((p) => {
          const active = activePreset?.label === p.label;
          return (
            <GradientPill key={p.label} active={active} onPress={() => onChange(p.mn, p.mx)} style={styles.presetPill}>
              <Text style={[styles.presetLabel, { color: active ? "#fff" : colors.mid }]}>{p.label}</Text>
            </GradientPill>
          );
        })}
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.valueText}>{min === 0 ? "Any" : `€${fmt(min)}`}</Text>
        <Text style={styles.toText}>to</Text>
        <Text style={styles.valueText}>{max >= BUDGET_MAX ? "€80,000+" : `€${fmt(max)}`}</Text>
      </View>
      <DualRangeSlider min={BUDGET_MIN} max={BUDGET_MAX} low={min} high={max} step={BUDGET_STEP} onChange={onChange} />
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>€0</Text>
        <Text style={styles.scaleText}>€20k</Text>
        <Text style={styles.scaleText}>€40k</Text>
        <Text style={styles.scaleText}>€60k</Text>
        <Text style={styles.scaleText}>€80k+</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  presetRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  presetPill: { paddingVertical: 5, paddingHorizontal: 12 },
  presetLabel: { fontFamily: fonts.semibold, fontSize: 12 },
  valueRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  valueText: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  toText: { fontFamily: fonts.medium, fontSize: 12, color: colors.mid },
  scaleRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  scaleText: { fontFamily: fonts.medium, fontSize: 10, color: colors.mid },
});
