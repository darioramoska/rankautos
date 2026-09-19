// Mirrors web/src/components/Onboarding.tsx. RN's ScrollView with pagingEnabled is the
// native equivalent of the web version's CSS scroll-snap carousel.
import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { colors, fonts, gradientBrand, radius, shadow } from "../lib/theme";
import { HeroSection } from "./info/HeroSection";
import { HowToUseSection } from "./info/HowToUseSection";
import { HowItWorksSection } from "./info/HowItWorksSection";

const SLIDE_COUNT = 4;

export function Onboarding({ onDone }: { onDone: () => void }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [slide, setSlide] = useState(0);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setSlide(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const scrollToSlide = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setSlide(i);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
      <Pressable onPress={onDone} style={[styles.skip, { top: insets.top + 10 }]}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        style={{ flex: 1 }}
      >
        <View style={{ width, flex: 1 }}>
          <HeroSection />
        </View>
        <View style={{ width, justifyContent: "center", flex: 1 }}>
          <HowToUseSection />
        </View>
        <View style={{ width, justifyContent: "center", flex: 1 }}>
          <HowItWorksSection />
        </View>
        <View style={[styles.finalSlide, { width }]}>
          <LinearGradient colors={gradientBrand} style={[styles.finalIcon, shadow.glow]}>
            <Svg width={30} height={30} viewBox="0 0 18 18" fill="none">
              <Path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </LinearGradient>
          <Text style={styles.finalTitle}>You&apos;re all set.</Text>
          <Text style={styles.finalSubtitle}>
            Tell us what you&apos;re looking for, and we&apos;ll rank every car ad in Europe by what matters to you.
          </Text>
          <Pressable onPress={onDone} style={shadow.glow}>
            <LinearGradient colors={gradientBrand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaBtn}>
              <Text style={styles.ctaText}>Let&apos;s go</Text>
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.dots, { paddingBottom: Math.max(16, insets.bottom) }]}>
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <Pressable key={i} onPress={() => scrollToSlide(i)} hitSlop={8}>
            <View style={[styles.dot, slide === i && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skip: {
    position: "absolute",
    right: 18,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  skipText: { fontFamily: fonts.semibold, fontSize: 12, color: "#fff" },

  finalSlide: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 20, backgroundColor: colors.bg },
  finalIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  finalTitle: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, letterSpacing: -0.5, textAlign: "center" },
  finalSubtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.mid, lineHeight: 22, textAlign: "center", maxWidth: 320 },
  ctaBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 16, paddingHorizontal: 30, borderRadius: radius.md },
  ctaText: { fontFamily: fonts.bold, fontSize: 15, color: "#fff" },

  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, paddingTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 20, backgroundColor: colors.grad2 },
});
