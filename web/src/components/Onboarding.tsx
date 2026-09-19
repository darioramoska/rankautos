"use client";

import { useRef, useState } from "react";
import { HeroSection } from "./info/HeroSection";
import { HowToUseSection } from "./info/HowToUseSection";
import { HowItWorksSection } from "./info/HowItWorksSection";
import { ONBOARDING_SEEN_KEY } from "@/lib/onboarding";

const SLIDE_COUNT = 4;

export function Onboarding({ onDone }: { onDone: () => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  const scrollToSlide = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  const finish = () => {
    try {
      localStorage.setItem(ONBOARDING_SEEN_KEY, "1");
    } catch {
      // localStorage unavailable (private mode, etc.) — just proceed without persisting.
    }
    onDone();
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "var(--bg)", zIndex: 300 }}>
      <button
        onClick={finish}
        className="absolute z-10 text-xs font-semibold rounded-full"
        style={{ top: 18, right: 18, color: "#fff", background: "rgba(255,255,255,0.16)", padding: "7px 16px" }}
      >
        Skip
      </button>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex-1 flex overflow-x-auto overflow-y-hidden"
        style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
      >
        <div className="flex-shrink-0 w-screen h-full overflow-y-auto" style={{ scrollSnapAlign: "start" }}>
          <HeroSection />
        </div>
        <div className="flex-shrink-0 w-screen h-full overflow-y-auto" style={{ scrollSnapAlign: "start" }}>
          <HowToUseSection />
        </div>
        <div className="flex-shrink-0 w-screen h-full overflow-y-auto" style={{ scrollSnapAlign: "start" }}>
          <HowItWorksSection />
        </div>
        <div className="flex-shrink-0 w-screen h-full overflow-y-auto" style={{ scrollSnapAlign: "start" }}>
          <div className="h-full flex flex-col items-center justify-center text-center gap-6" style={{ padding: "40px 32px" }}>
            <div className="flex items-center justify-center rounded-2xl gradient-brand shadow-glow" style={{ width: 64, height: 64 }}>
              <svg width="30" height="30" viewBox="0 0 18 18" fill="none">
                <path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold" style={{ fontSize: 28, letterSpacing: "-0.5px", marginBottom: 10 }}>
                You&apos;re all set.
              </h2>
              <p className="text-[15px]" style={{ color: "var(--mid)", maxWidth: 340, lineHeight: 1.7 }}>
                Tell us what you&apos;re looking for, and we&apos;ll rank every car ad in Europe by what matters to you.
              </p>
            </div>
            <button
              onClick={finish}
              className="flex items-center gap-2.5 font-bold text-[15px] transition-all duration-100 hover:-translate-y-px gradient-brand shadow-glow"
              style={{ padding: "16px 36px", color: "#fff", borderRadius: "var(--radius)" }}
            >
              Let&apos;s go
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2" style={{ padding: "16px 0 max(16px, env(safe-area-inset-bottom))" }}>
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: slide === i ? 20 : 6,
              height: 6,
              borderRadius: 999,
              background: slide === i ? "var(--grad-2)" : "var(--border)",
              transition: "all .2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
