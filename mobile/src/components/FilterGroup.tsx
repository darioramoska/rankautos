// Ported from web/src/components/FilterGroup.tsx — collapsible accordion. Web used a plain
// `open && children` conditional render; here we do the same but wrap the toggle in
// LayoutAnimation so the expand/collapse animates instead of snapping.
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  colors,
  fonts,
  gradientBrand,
  gradientTileSoft,
  gradientTileSoftActive,
  radius,
  shadow,
  tileSoftActiveBorder,
  tileSoftBorder,
} from "../lib/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function FilterGroup({
  label,
  count,
  icon,
  children,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View style={[styles.card, open ? shadow.cardLg : null, { borderColor: open ? "transparent" : colors.border }]}>
      <Pressable onPress={toggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={open ? gradientTileSoftActive : gradientTileSoft}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.tile,
              { borderColor: open ? tileSoftActiveBorder : tileSoftBorder },
            ]}
          >
            {icon}
          </LinearGradient>
          <Text style={styles.label}>{label}</Text>
          {count > 0 && (
            <LinearGradient colors={gradientBrand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.countBadge}>
              <Text style={styles.countText}>{count} selected</Text>
            </LinearGradient>
          )}
        </View>
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
          <Path d="M4 6l4 4 4-4" stroke={colors.mid} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },
  tile: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  label: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  countBadge: { borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 2 },
  countText: { fontFamily: fonts.bold, fontSize: 11, color: "#fff" },
  body: { paddingHorizontal: 16, paddingBottom: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
});
