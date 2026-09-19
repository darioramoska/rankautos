import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { CRITERIA } from "./data";
import type { Weights } from "./types";

const STORAGE_KEY = "rankautos.weights";

export const DEFAULT_WEIGHTS: Weights = CRITERIA.reduce((acc, c) => {
  acc[c.key] = 5;
  return acc;
}, {} as Weights);

export function useWeights() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) setWeights({ ...DEFAULT_WEIGHTS, ...JSON.parse(raw) });
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(weights)).catch(() => {
      // ignore quota / privacy-mode errors
    });
  }, [weights, loaded]);

  const reset = () => setWeights(DEFAULT_WEIGHTS);

  return { weights, setWeights, reset };
}
