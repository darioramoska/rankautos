// Ported from web/src/components/WeightSlider.tsx — one of the 7 sidebar sliders on Results
// that live-re-rank the list. Single-value slider (@react-native-assets/slider's <Slider>).
import React from "react";
import Slider from "@react-native-assets/slider";
import { StyleSheet, Text, View } from "react-native";
import type { Criterion } from "../lib/types";
import { colors, fonts } from "../lib/theme";

export function WeightSlider({
  criterion,
  value,
  onChange,
}: {
  criterion: Criterion;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.labelCol}>
        <Text style={styles.label}>{criterion.label}</Text>
        <Text style={styles.desc}>{criterion.desc}</Text>
      </View>
      <Slider
        value={value}
        minimumValue={0}
        maximumValue={10}
        step={1}
        minimumTrackTintColor={colors.grad2}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.grad3}
        trackHeight={4}
        thumbSize={18}
        style={styles.slider}
        onValueChange={onChange}
      />
      <Text style={[styles.value, { color: value === 0 ? colors.border : colors.accent }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  labelCol: { width: 120, flexShrink: 0 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  desc: { fontFamily: fonts.regular, fontSize: 11, color: colors.mid, marginTop: 1 },
  slider: { flex: 1, height: 26 },
  value: { width: 22, textAlign: "right", fontFamily: fonts.bold, fontSize: 14 },
});
