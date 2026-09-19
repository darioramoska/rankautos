// RN has no native <select> equivalent, so this is a Pressable trigger (styled like
// the web version's select box) that opens a bottom-sheet Modal listing the options —
// same visual language as the rest of the filter UI (surface cards, brand accent color).
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { colors, fonts, radius, shadow } from "../lib/theme";

export function Dropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
        <Text style={[styles.triggerText, !value && styles.placeholderText]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <Path d="M4 6l4 4 4-4" stroke={colors.mid} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, shadow.cardLg, { paddingBottom: Math.max(16, insets.bottom) }]}>
            <View style={styles.handle} />
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              <Pressable onPress={() => select("")} style={styles.option}>
                <Text style={[styles.optionText, !value && styles.optionTextActive]}>{placeholder}</Text>
                {!value && <View style={styles.dot} />}
              </Pressable>
              {options.map((opt) => (
                <Pressable key={opt} onPress={() => select(opt)} style={styles.option}>
                  <Text style={[styles.optionText, value === opt && styles.optionTextActive]}>{opt}</Text>
                  {value === opt && <View style={styles.dot} />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  triggerText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, flex: 1, marginRight: 8 },
  placeholderText: { color: colors.mid },

  backdrop: { flex: 1, backgroundColor: "rgba(20,8,48,0.5)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: 10,
    maxHeight: "70%",
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center", marginBottom: 8 },
  list: { paddingHorizontal: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  optionText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  optionTextActive: { color: colors.grad2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.grad2 },
});
