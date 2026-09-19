// Mirrors web/src/lib/supabaseClient.ts. React Native needs two things the
// browser gives you for free: a URL polyfill (Hermes has no built-in URL
// implementation, which supabase-js requires) and an explicit AsyncStorage
// adapter so the session survives an app restart.
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// AsyncStorage's web implementation reaches for `window` directly. That's fine
// in a real browser, but Expo Router's web target also does an initial
// server-side render pass in Node (no `window`), and supabase-js eagerly
// reads storage the moment createClient() runs — so a plain AsyncStorage
// adapter crashes the SSR pass. This wrapper no-ops during that pass instead.
const ssrSafeStorage = {
  getItem: (key: string) => (typeof window === "undefined" ? Promise.resolve(null) : AsyncStorage.getItem(key)),
  setItem: (key: string, value: string) => (typeof window === "undefined" ? Promise.resolve() : AsyncStorage.setItem(key, value)),
  removeItem: (key: string) => (typeof window === "undefined" ? Promise.resolve() : AsyncStorage.removeItem(key)),
};

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage: ssrSafeStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export const isSupabaseConfigured = supabase !== null;
