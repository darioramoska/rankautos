"use client";

// Mirrors useWeights.ts. Filters used to travel only via the Home screen's CTA
// button (encoded into the /results URL), so any other way of reaching Results —
// the bottom nav's "Rankings" tab, browser back/forward, a refresh — landed on
// DEFAULT_FILTERS and silently ignored whatever the user had picked. Persisting
// to localStorage (like weights already do) makes Home and Results share one
// source of truth regardless of navigation path.
import { useEffect, useState } from "react";
import { DEFAULT_FILTERS } from "./filters";
import type { Filters } from "./types";

const STORAGE_KEY = "rankautos.filters";

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFilters({ ...DEFAULT_FILTERS, ...JSON.parse(raw) });
    } catch {
      // ignore malformed storage
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return; // avoid clobbering storage with defaults before the initial load resolves
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [filters, loaded]);

  const reset = () => setFilters(DEFAULT_FILTERS);

  return { filters, setFilters, reset, loaded };
}
