"use client";

// One shared instance (Context) — per-card hook copies would each hold their own stale list and
// overwrite each other's writes. Signed-out: browser storage only. Signed-in: the `favorites`
// table is the source of truth; on sign-in local + remote are merged (union) and any local-only
// ids are pushed up, so favoriting before creating an account isn't lost.
// Storage key is v2 on purpose: car ids changed when the catalog moved to database ids, so
// ids saved under the old key would silently point at different cars.
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_KEY = "rankautos.favorites.v2";

interface FavoritesContextValue {
  favorites: number[];
  isFavorite: (carId: number) => boolean;
  toggleFavorite: (carId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [favorites, loaded]);

  // On sign-in: merge remote into local and push local-only ids up.
  useEffect(() => {
    if (!loaded || !userId || !supabase) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("favorites").select("car_model_id");
      if (cancelled || error || !data) return;
      const remote = data.map((r) => r.car_model_id as number);
      setFavorites((local) => {
        const missing = local.filter((id) => !remote.includes(id));
        if (missing.length) {
          void supabase!.from("favorites").upsert(
            missing.map((car_model_id) => ({ user_id: userId, car_model_id })),
            { onConflict: "user_id,car_model_id", ignoreDuplicates: true }
          );
        }
        return Array.from(new Set([...local, ...remote]));
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [loaded, userId]);

  const toggleFavorite = useCallback(
    (carId: number) => {
      setFavorites((f) => {
        const removing = f.includes(carId);
        if (userId && supabase) {
          if (removing) void supabase.from("favorites").delete().eq("user_id", userId).eq("car_model_id", carId);
          else
            void supabase
              .from("favorites")
              .upsert({ user_id: userId, car_model_id: carId }, { onConflict: "user_id,car_model_id", ignoreDuplicates: true });
        }
        return removing ? f.filter((id) => id !== carId) : [...f, carId];
      });
    },
    [userId]
  );

  const isFavorite = (carId: number) => favorites.includes(carId);

  return <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
