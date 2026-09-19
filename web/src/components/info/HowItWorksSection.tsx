// Extracted from the old always-visible HomeScreen "How it works" diagram.
// Now shown in Onboarding (slide 3) and on the Profile > Help page. Stacked
// top-to-bottom (not a horizontal scroller) so it reads in one pass on any width.
const SOURCE_PLATFORMS = [
  { flag: "🇪🇺", name: "AutoScout24" },
  { flag: "🇩🇪", name: "mobile.de" },
  { flag: "🇫🇷", name: "LaCentrale" },
  { flag: "🇳🇱", name: "Marktplaats" },
  { flag: "🇵🇱", name: "Otomoto" },
];

const SAMPLE_RESULTS = [
  { r: "#1", n: "Ioniq 5", s: "9.2" },
  { r: "#2", n: "Model Y", s: "8.8" },
  { r: "#3", n: "Enyaq 85", s: "8.5" },
];

const CONNECTOR = (label: string) => (
  <div className="flex flex-col items-center gap-2" style={{ padding: "10px 0" }}>
    <svg width="18" height="34" viewBox="0 0 18 34" fill="none">
      <path d="M9 2 C15 12, 15 20, 9 30" stroke="var(--border)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
      <path d="M5 25l4 6 4-6" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span
      className="font-bold uppercase whitespace-nowrap rounded-full"
      style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--mid)", background: "var(--bg)", padding: "3px 9px", border: "1px solid var(--border)" }}
    >
      {label}
    </span>
  </div>
);

export function HowItWorksSection() {
  return (
    <div className="flex flex-col items-center" style={{ minHeight: "100%", background: "var(--surface)", padding: "40px 32px" }}>
      <div className="text-[11px] font-bold uppercase text-center" style={{ letterSpacing: 2, color: "var(--mid)", marginBottom: 30 }}>
        How it works
      </div>

      <div className="flex flex-col items-center" style={{ width: "100%", maxWidth: 320 }}>
        <div className="flex flex-col gap-1.5" style={{ width: "100%" }}>
          {SOURCE_PLATFORMS.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--dark)", background: "var(--bg)", padding: "8px 12px", border: "1px solid var(--border)" }}
            >
              <span>{p.flag}</span>
              <span>{p.name}</span>
            </div>
          ))}
          <div
            className="text-center italic rounded-lg"
            style={{ fontSize: 12, color: "var(--mid)", background: "var(--bg)", padding: "8px 12px", border: "1px dashed var(--border)" }}
          >
            + 5 more platforms
          </div>
        </div>

        {CONNECTOR("daily scan")}

        <div className="text-center gradient-brand shadow-glow" style={{ borderRadius: 16, padding: "20px 24px", width: "100%" }}>
          <div className="text-[16px] font-extrabold text-white">RankAutos</div>
          <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)", marginTop: 3, letterSpacing: 0.5 }}>
            scores &amp; ranks
          </div>
          <div className="flex flex-wrap justify-center gap-1.5" style={{ marginTop: 12 }}>
            {["Range", "Safety", "Value", "Tech", "Reliability"].map((c) => (
              <div key={c} className="rounded" style={{ fontSize: 10, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", padding: "3px 7px" }}>
                {c}
              </div>
            ))}
          </div>
        </div>

        {CONNECTOR("ranked list")}

        <div className="flex flex-col gap-1.5" style={{ width: "100%" }}>
          {SAMPLE_RESULTS.map((c) => (
            <div key={c.r} className="flex items-center gap-2.5 rounded-lg" style={{ background: "var(--bg)", padding: "9px 12px", border: "1px solid var(--border)" }}>
              <span className="font-extrabold" style={{ fontSize: 11, color: "var(--mid)", width: 20 }}>
                {c.r}
              </span>
              <span className="font-semibold flex-1" style={{ fontSize: 13 }}>
                {c.n}
              </span>
              <span className="font-extrabold" style={{ fontSize: 13, color: "oklch(0.68 0.18 145)" }}>
                {c.s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
