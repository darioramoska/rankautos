"use client";

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWeights({ ...DEFAULT_WEIGHTS, ...JSON.parse(raw) });
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [weights]);

  const reset = () => setWeights(DEFAULT_WEIGHTS);

  return { weights, setWeights, reset };
}
