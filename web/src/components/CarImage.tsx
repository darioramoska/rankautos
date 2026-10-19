"use client";

import { useEffect, useState } from "react";
import { CUTOUTS, type Cutout } from "@/lib/cutouts";
import type { CarModel } from "@/lib/types";

// Catalog rows without an explicit wikipedia_query fall back to "Brand Model Variant"
// (e.g. "Citroën C5 Aircross BlueHDi"), which rarely names an article. Try the full
// string first, then drop trailing words down to "Brand Model".
const candidates = (query: string) => {
  const words = query.trim().split(/\s+/);
  const out: string[] = [];
  for (let n = words.length; n >= Math.min(2, words.length); n--) out.push(words.slice(0, n).join(" "));
  return out;
};

export function findCutout(query: string): Cutout | undefined {
  for (const q of candidates(query)) if (CUTOUTS[q]) return CUTOUTS[q];
  return undefined;
}

const wikiCache: Record<string, string | false | null> = {};

export function useWikiImage(query: string) {
  const [url, setUrl] = useState<string | null>(
    typeof wikiCache[query] === "string" ? (wikiCache[query] as string) : null,
  );

  useEffect(() => {
    if (!query) return;
    if (wikiCache[query] !== undefined) {
      setUrl(wikiCache[query] || null);
      return;
    }
    wikiCache[query] = null; // mark as in-flight
    (async () => {
      for (const q of candidates(query)) {
        const data = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&redirects=1&titles=${encodeURIComponent(
            q,
          )}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
        ).then((r) => r.json());
        const pages = data?.query?.pages || {};
        const page = pages[Object.keys(pages)[0]];
        const src: string | undefined = page?.thumbnail?.source;
        if (src) return src;
      }
      return false as const;
    })()
      .then((src) => {
        wikiCache[query] = src;
        if (src) setUrl(src);
      })
      .catch(() => {
        wikiCache[query] = false;
      });
  }, [query]);

  return url;
}

export function CarImage({
  car,
  w,
  h,
  className = "",
}: {
  car: CarModel;
  w: number;
  h: number;
  className?: string;
}) {
  const cut = findCutout(car.wikiQuery);
  const [cutFailed, setCutFailed] = useState(false);
  const url = useWikiImage(cut && !cutFailed ? "" : car.wikiQuery);
  const [failed, setFailed] = useState(false);

  if (cut && !cutFailed) {
    return (
      <div
        className={`car-cutout tile-soft flex-shrink-0 rounded-xl overflow-hidden ${className}`}
        style={{ width: w, height: h }}
      >
        <span className="car-cutout-shadow" aria-hidden />
        <img src={cut.src} alt={`${car.brand} ${car.name}`} onError={() => setCutFailed(true)} />
      </div>
    );
  }

  if (url && !failed) {
    return (
      <div
        className={`flex-shrink-0 rounded-xl overflow-hidden ${className}`}
        style={{ width: w, height: h, border: "1px solid var(--border)", background: "#f0ede9" }}
      >
        <img
          src={url}
          alt={`${car.brand} ${car.name}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`tile-soft flex-shrink-0 rounded-xl flex flex-col items-center justify-center ${className}`}
      style={{ width: w, height: h }}
    >
      <svg width={w * 0.6} height={h * 0.5} viewBox="0 0 100 55" fill="none">
        <rect x="5" y="25" width="90" height="22" rx="4" fill={car.color} opacity="0.18" />
        <rect x="18" y="10" width="64" height="20" rx="6" fill={car.color} opacity="0.28" />
        <circle cx="22" cy="47" r="8" fill={car.color} opacity="0.32" />
        <circle cx="22" cy="47" r="4" fill={car.color} opacity="0.5" />
        <circle cx="78" cy="47" r="8" fill={car.color} opacity="0.32" />
        <circle cx="78" cy="47" r="4" fill={car.color} opacity="0.5" />
      </svg>
      <span
        className="text-[9px] uppercase mt-1"
        style={{ color: "var(--mid)", letterSpacing: 1, fontFamily: "monospace" }}
      >
        {car.brand}
      </span>
    </div>
  );
}
