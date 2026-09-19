// Mirrors web/src/components/ProfileScreen.tsx.
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, fonts, gradientHero, radius, shadow } from "../lib/theme";
import { useAuth } from "../lib/auth/AuthProvider";
import { AuthForm } from "../components/AuthForm";

function MenuRow({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, styles.menuRow]}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <Path d="M6 3l5 5-5 5" stroke={colors.mid} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

export function ProfileScreen() {
  const { user, loading, configured, signOut } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <LinearGradient colors={gradientHero} style={styles.hero}>
        <View style={styles.avatar}>
          <Svg width={28} height={28} viewBox="0 0 20 20" fill="none">
            <Circle cx={10} cy={7} r={3.4} stroke="#fff" strokeWidth={1.8} />
            <Path d="M3.5 17c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={styles.heroTitle}>{user ? `Hi, ${user.user_metadata?.display_name || user.email}` : "You're browsing as a guest"}</Text>
        <Text style={styles.heroSubtitle}>
          {user ? "Manage your account below." : "Sign in to save searches, priority weights, and get price-drop alerts."}
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        {!configured ? (
          <View style={[styles.card, shadow.card, { alignItems: "center" }]}>
            <Text style={styles.mutedText}>Accounts aren&apos;t configured yet.</Text>
          </View>
        ) : loading ? (
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <ActivityIndicator color={colors.grad2} />
          </View>
        ) : user ? (
          <View style={{ gap: 14 }}>
            <View style={[styles.card, shadow.card]}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>{user.email}</Text>
              <Pressable onPress={() => signOut()} style={styles.signOutBtn}>
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
            </View>
            <View style={[styles.card, shadow.card]}>
              <Text style={styles.cardTitle}>Coming soon</Text>
              <Text style={styles.cardRow}>• Save your filter presets and priority weights</Text>
              <Text style={styles.cardRow}>• Email alerts when a saved search&apos;s best price drops</Text>
              <Text style={styles.cardRow}>• Sync your rankings between web and this app</Text>
            </View>
          </View>
        ) : (
          <AuthForm />
        )}

        <View style={{ gap: 12, marginTop: 20 }}>
          <MenuRow
            label="Help"
            onPress={() => router.push("/help")}
            icon={
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Circle cx={8} cy={8} r={6.2} stroke={colors.grad2} strokeWidth={1.5} />
                <Path d="M6.2 6.3c.2-1 1-1.6 1.9-1.6 1.1 0 2 .7 2 1.7 0 .9-.6 1.3-1.3 1.7-.6.4-.8.7-.8 1.3" stroke={colors.grad2} strokeWidth={1.4} strokeLinecap="round" />
                <Circle cx={8} cy={11.3} r={0.15} stroke={colors.grad2} strokeWidth={1.5} />
              </Svg>
            }
          />
          <MenuRow
            label="Disclaimer"
            onPress={() => router.push("/disclaimer")}
            icon={
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Path d="M8 1.5l6.2 3.4v6.2L8 14.5l-6.2-3.4V4.9L8 1.5Z" stroke={colors.grad2} strokeWidth={1.4} strokeLinejoin="round" />
                <Path d="M8 6v3" stroke={colors.grad2} strokeWidth={1.5} strokeLinecap="round" />
                <Circle cx={8} cy={11} r={0.2} stroke={colors.grad2} strokeWidth={1.5} />
              </Svg>
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 32 },
  hero: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 36, alignItems: "flex-start" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: { fontFamily: fonts.bold, fontSize: 20, color: "#fff", marginBottom: 6 },
  heroSubtitle: { fontFamily: fonts.regular, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 19 },

  body: { padding: 20 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 18 },
  mutedText: { fontFamily: fonts.regular, fontSize: 13, color: colors.mid },

  fieldLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.mid, marginBottom: 4 },
  fieldValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink, marginBottom: 16 },
  signOutBtn: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.full, paddingVertical: 10, paddingHorizontal: 18, alignSelf: "flex-start" },
  signOutText: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },

  cardTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 8 },
  cardRow: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.mid, lineHeight: 19 },

  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  menuIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentLight, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
});
