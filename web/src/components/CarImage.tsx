"use client";

import { useEffect, useState } from "react";
import type { CarModel } from "@/lib/types";

const wikiCache: Record<string, string | false | null> = {};

function useWikiImage(query: string) {
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
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        query,
      )}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
    )
      .then((r) => r.json())
      .then((data) => {
        const pages = data?.query?.pages || {};
        const page = pages[Object.keys(pages)[0]];
        const src: string | false = page?.thumbnail?.source || false;
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
  const url = useWikiImage(car.wikiQuery);
  const [failed, setFailed] = useState(false);

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
