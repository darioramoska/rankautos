// Mirrors web/src/components/AuthForm.tsx.
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, gradientBrand, radius, shadow } from "../lib/theme";
import { useAuth } from "../lib/auth/AuthProvider";

type Mode = "signin" | "signup";

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setInfo(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setInfo(null);
    if (mode === "signup" && !gdprConsent) {
      setError("Please agree to the privacy policy to create an account.");
      return;
    }
    setBusy(true);
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password, displayName, gdprConsent);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      setInfo("Check your email to confirm your account, then sign in.");
      setMode("signin");
    }
  };

  return (
    <View style={[styles.card, shadow.card]}>
      <View style={styles.tabRow}>
        {(["signin", "signup"] as const).map((m) => (
          <GhostTab key={m} active={mode === m} label={m === "signin" ? "Sign in" : "Create account"} onPress={() => switchMode(m)} />
        ))}
      </View>

      {mode === "signup" && (
        <Field label="Name">
          <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholder="Your name" placeholderTextColor={colors.mid} autoComplete="name" />
        </Field>
      )}
      <Field label="Email">
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.mid}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
      </Field>
      <Field label="Password">
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={colors.mid}
          secureTextEntry
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />
      </Field>

      {mode === "signup" && (
        <Pressable onPress={() => setGdprConsent((v) => !v)} style={styles.consentRow}>
          <View style={[styles.checkbox, gdprConsent && styles.checkboxChecked]}>
            {gdprConsent && <Text style={styles.checkboxMark}>✓</Text>}
          </View>
          <Text style={styles.consentText}>I agree to the privacy policy and consent to my data being processed to create an account.</Text>
        </Pressable>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
      {info && <Text style={styles.infoText}>{info}</Text>}

      <Pressable onPress={handleSubmit} disabled={busy} style={{ opacity: busy ? 0.7 : 1, marginTop: 6 }}>
        <LinearGradient colors={gradientBrand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitBtn}>
          <Text style={styles.submitText}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function GhostTab({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  if (active) {
    return (
      <LinearGradient colors={gradientBrand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tabBtn}>
        <Pressable onPress={onPress}>
          <Text style={styles.tabTextActive}>{label}</Text>
        </Pressable>
      </LinearGradient>
    );
  }
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={styles.tabText}>{label}</Text>
    </Pressable>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 20 },
  tabRow: { flexDirection: "row", gap: 4, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, padding: 3, marginBottom: 18, alignSelf: "flex-start" },
  tabBtn: { borderRadius: radius.full, paddingVertical: 8, paddingHorizontal: 16 },
  tabText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.mid },
  tabTextActive: { fontFamily: fonts.semibold, fontSize: 12, color: "#fff" },

  label: { fontFamily: fonts.semibold, fontSize: 11, color: colors.mid, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.surface,
  },

  consentRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 2, marginBottom: 4 },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.grad2, borderColor: colors.grad2 },
  checkboxMark: { color: "#fff", fontSize: 11, fontFamily: fonts.bold },
  consentText: { flex: 1, fontFamily: fonts.regular, fontSize: 11.5, color: colors.mid, lineHeight: 16 },

  errorText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.red, marginTop: 4 },
  infoText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.green, marginTop: 4 },

  submitBtn: { borderRadius: radius.md, paddingVertical: 13, alignItems: "center" },
  submitText: { fontFamily: fonts.bold, fontSize: 14, color: "#fff" },
});
