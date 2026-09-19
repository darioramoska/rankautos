// Shared dual-thumb range slider used by BudgetRange (Home) and the boot-space filter (Home).
// The web app hand-rolled this with two overlapping <input type="range"> elements (see
// web/src/components/BudgetRange.tsx and the boot-space block in HomeScreen.tsx). React Native
// has no built-in range slider, so this wraps @react-native-assets/slider's <RangeSlider> —
// it's pure JS (no native module to link), explicitly supports react-native-web, and matches
// the "evaluate @react-native-assets/slider first" guidance since it's a real two-thumb control
// rather than a step-down (two adjacent sliders / steppers) approximation.
import React from "react";
import { RangeSlider } from "@react-native-assets/slider";
import { StyleSheet, View } from "react-native";
import { colors } from "../lib/theme";

export function DualRangeSlider({
  min,
  max,
  low,
  high,
  step,
  onChange,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  step: number;
  onChange: (low: number, high: number) => void;
}) {
  return (
    <View style={styles.wrap}>
      <RangeSlider
        range={[low, high]}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumRange={step}
        outboundColor={colors.border}
        inboundColor={colors.grad2}
        thumbTintColor={colors.grad3}
        trackHeight={4}
        thumbSize={20}
        thumbStyle={styles.thumb}
        onValueChange={(range) => onChange(range[0], range[1])}
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 4 },
  slider: { width: "100%", height: 28 },
  thumb: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: colors.grad2,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
