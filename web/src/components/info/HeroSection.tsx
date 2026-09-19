// Extracted from the old always-visible HomeScreen hero block. Now used only by
// Onboarding (slide 1). Fills the full slide height with the gradient and centers
// everything — the parent slide wrapper just needs to be full-height for this to work.
import { CAR_DATA, PLATFORMS } from "@/lib/data";

export function HeroSection() {
  const modelCount = CAR_DATA.length;
  const platformCount = PLATFORMS.length;

  return (
    <div
      className="relative overflow-hidden text-white gradient-hero flex flex-col items-center justify-center text-center"
      style={{ minHeight: "100%", padding: "60px 32px" }}
    >
      <div
        className="absolute rounded-full gradient-blob-warm"
        style={{ width: 460, height: 460, right: -140, bottom: -220, opacity: 0.55, filter: "blur(10px)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(192,38,212,0.35), transparent 55%)" }}
      />
      <div className="relative flex flex-col items-center" style={{ maxWidth: 520 }}>
        <div className="flex items-center justify-center gap-2.5" style={{ marginBottom: 32 }}>
          <div className="flex items-center justify-center rounded-xl gradient-brand shadow-glow" style={{ width: 34, height: 34 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 13L6 6L9 9.5L12 4L15 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold text-lg" style={{ letterSpacing: "-0.3px" }}>
            RankAutos
          </span>
          <span className="text-[10px] rounded-full" style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", color: "rgba(255,255,255,0.5)" }}>
            Pan-European
          </span>
        </div>

        <div className="glass-pill inline-block text-xs font-semibold uppercase rounded-full" style={{ letterSpacing: 2, color: "#f3d9fb", marginBottom: 18, padding: "5px 14px" }}>
          One search. Every platform. Best price.
        </div>
        <h1 className="font-bold" style={{ fontSize: "clamp(26px,5vw,46px)", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
          See all car ads in one place —<br />
          <span className="gradient-text">ranked to find your dream car.</span>
        </h1>
        <p className="text-[15px]" style={{ marginTop: 18, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
          We scan AutoScout24, mobile.de, and {platformCount - 2} other EU platforms daily, score every listing across 7
          criteria, and rank them by what matters to you.
        </p>

        <div className="flex flex-wrap justify-center gap-7" style={{ marginTop: 30 }}>
          {(
            [
              [String(modelCount), "models"],
              ["7", "criteria"],
              [String(platformCount), "EU platforms"],
              ["Daily", "refresh"],
            ] as const
          ).map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-xl font-bold gradient-text">{n}</div>
              <div className="text-[10px] uppercase" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
