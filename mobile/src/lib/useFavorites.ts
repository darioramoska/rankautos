// Context-based like useFilters.ts (NativeTabs keeps every tab mounted, so per-screen local state
// goes stale). Signed-out: AsyncStorage only. Signed-in: the `favorites` table is the source of
// truth; on sign-in local + remote are merged (union) and local-only ids are pushed up.
// Storage key is v2: car ids changed when the catalog moved to database ids, so ids saved under
// the old key would silently point at different cars.
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "./supabaseClient";

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
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!cancelled && raw) setFavorites(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites, loaded]);

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

  return React.createElement(FavoritesContext.Provider, { value: { favorites, isFavorite, toggleFavorite } }, children);
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites() must be called within <FavoritesProvider>, see app/_layout.tsx");
  return ctx;
}
