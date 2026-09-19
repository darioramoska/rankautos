// Small shared helper: a Pressable that fills with the brand gradient + glow shadow when
// `active`, otherwise a plain surface pill with a border. Used by chips, filter toggles,
// sort/condition segmented controls, etc. — the RN equivalent of the web app's
// `gradient-brand shadow-glow` utility classes applied conditionally.
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors, gradientBrand, radius, shadow } from "../lib/theme";

export function GradientPill({
  active,
  onPress,
  children,
  style,
  borderRadius = radius.full,
}: {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
}) {
  if (active) {
    return (
      <Pressable onPress={onPress} style={[shadow.glow, { borderRadius }]}>
        <LinearGradient
          colors={gradientBrand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, { borderRadius }, style]}
        >
          {children}
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={[styles.base, styles.inactive, { borderRadius }, style]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
  },
  inactive: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
});
