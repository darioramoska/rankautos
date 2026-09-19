"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/lib/useFavorites";
import { useWeights } from "@/lib/useWeights";
import { modelWeightedScore } from "@/lib/scoring";
import type { CarModel } from "@/lib/types";
import { ResultCard } from "./ResultCard";

// Compact hero (logo/name/motto/stats only — no headline or "how it works" copy,
// that lives in Onboarding/Help) that shrinks and fades as the favorites list
// scrolls up underneath it, rather than staying full-size or scrolling away flat.
const FADE_DISTANCE = 220; // px of scroll over which the hero fully collapses

export function DashboardScreen({ cars }: { cars: CarModel[] }) {
  const router = useRouter();
  const { favorites } = useFavorites();
  const { weights } = useWeights();
  const [scrollT, setScrollT] = useState(0); // 0 = fully expanded, 1 = fully collapsed
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrollT(Math.max(0, Math.min(1, el.scrollTop / FADE_DISTANCE)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const favoriteCars = cars
    .filter((c) => favorites.includes(c.id))
    .map((car) => ({ car, score: modelWeightedScore(car, weights) }))
    .sort((a, b) => b.score - a.score);

  const modelCount = cars.length;

  return (
    <div ref={scrollerRef} className="min-h-screen overflow-y-auto" style={{ background: "var(--bg)", height: "100vh" }}>
      <div
        className="sticky top-0 z-10 gradient-hero text-white flex flex-col items-center text-center overflow-hidden"
        style={{
          paddingTop: 60 - scrollT * 34,
          paddingBottom: 28 - scrollT * 20,
          paddingLeft: 24,
          paddingRight: 24,
          opacity: 1 - scrollT * 0.55,
        }}
      >
        <div className="flex items-center gap-2.5" style={{ marginBottom: 14 - scrollT * 10 }}>
          <div
            className="flex items-center justify-center rounded-xl gradient-brand shadow-glow flex-shrink-0"
            style={{ width: 30 - scrollT * 6, height: 30 - scrollT * 6, transition: "width .1s, height .1s" }}
          >
            <svg width={16 - scrollT * 3} height={16 - scrollT * 3} viewBox="0 0 18 18" fill="none">
              <path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold" style={{ fontSize: 18 - scrollT * 3 }}>
            RankAutos
          </span>
        </div>
        <div
          className="glass-pill inline-block text-xs font-semibold uppercase rounded-full"
          style={{
            letterSpacing: 2,
            color: "#f3d9fb",
            padding: "5px 14px",
            marginBottom: 16 - scrollT * 16,
            maxHeight: scrollT > 0.7 ? 0 : 40,
            overflow: "hidden",
            transition: "max-height .15s",
          }}
        >
          One search. Every platform. Best price.
        </div>
        <div
          className="flex flex-wrap justify-center gap-7"
          style={{ maxHeight: scrollT > 0.5 ? 0 : 60, overflow: "hidden", transition: "max-height .15s" }}
        >
          {(
            [
              [String(modelCount), "models"],
              ["7", "criteria"],
              ["Daily", "refresh"],
            ] as const
          ).map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-lg font-bold gradient-text">{n}</div>
              <div className="text-[9px] uppercase" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full" style={{ maxWidth: 860, padding: "24px 24px 140px" }}>
        <div className="text-base font-bold" style={{ marginBottom: 4 }}>
          Your favorites
        </div>
        <div className="text-xs" style={{ color: "var(--mid)", marginBottom: 16 }}>
          {favoriteCars.length === 0
            ? "Tap the heart on any car in Rankings to save it here."
            : `${favoriteCars.length} car${favoriteCars.length !== 1 ? "s" : ""} saved`}
        </div>

        {favoriteCars.length === 0 ? (
          <div
            className="text-center rounded-2xl"
            style={{ padding: "48px 20px", color: "var(--mid)", background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            No favorites yet.{" "}
            <button onClick={() => router.push("/results")} className="font-semibold" style={{ color: "var(--grad-2)" }}>
              Browse rankings
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favoriteCars.map(({ car, score }, i) => (
              <ResultCard key={car.id} car={car} rank={i + 1} score={score} onClick={() => router.push(`/results?car=${car.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
