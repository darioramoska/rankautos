// Mirrors web/src/lib/auth/AuthProvider.tsx — same Supabase Auth API, same
// context shape, just backed by the AsyncStorage-persisted RN client instead
// of the browser client.
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../supabaseClient";

interface AuthResult {
  error: string | null;
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string, gdprConsent: boolean) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configured: isSupabaseConfigured,
      async signIn(email, password) {
        if (!supabase) return { error: "Supabase isn't configured." };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signUp(email, password, displayName, gdprConsent) {
        if (!supabase) return { error: "Supabase isn't configured." };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName, gdpr_consent: gdprConsent } },
        });
        if (error) return { error: error.message };
        return { error: null, needsEmailConfirmation: !data.session };
      },
      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
