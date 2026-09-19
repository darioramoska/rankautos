// NativeTabs (see app/(tabs)/_layout.tsx) keeps every tab's screen tree mounted in the
// background rather than unmounting it on switch — that's what makes native tab
// switching instant. It also means a per-screen hook that reads AsyncStorage once at
// mount (the old approach here) goes stale the moment you change a filter on one tab
// and switch back to an already-mounted screen on another: that screen's local copy
// never learns about the change. A single Context instance shared by all screens fixes
// this at the root — there is only ever one `filters` value, so every consumer is
// always in sync, no re-read-on-focus polling needed.
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_FILTERS } from "./filters";
import type { Filters } from "./types";

const STORAGE_KEY = "rankautos.filters";

interface FiltersContextValue {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  reset: () => void;
  loaded: boolean;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) setFilters({ ...DEFAULT_FILTERS, ...JSON.parse(raw) });
      })
      .catch(() => {
        // ignore malformed storage
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return; // avoid clobbering storage with defaults before the initial load resolves
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filters)).catch(() => {
      // ignore quota / privacy-mode errors
    });
  }, [filters, loaded]);

  const reset = () => setFilters(DEFAULT_FILTERS);

  return React.createElement(FiltersContext.Provider, { value: { filters, setFilters, reset, loaded } }, children);
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error("useFilters() must be called within <FiltersProvider>, see app/_layout.tsx");
  }
  return ctx;
}
