// Extracted from the old always-visible HomeScreen "How to use RankAutos" strip.
// Now shown in Onboarding (slide 2) and on the Profile > Help page.
export function HowToUseSection() {
  const steps = [
    {
      n: "1",
      title: "Set your filters",
      desc: "Choose fuel type, body style, budget, and more",
      icon: (
        <svg width="32" height="32" viewBox="0 0 52 52" fill="none">
          <path d="M14 19h24M18 26h16M22 33h8" stroke="var(--grad-2)" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="19" cy="19" r="3.5" fill="var(--surface)" stroke="var(--grad-2)" strokeWidth="2" />
          <circle cx="33" cy="26" r="3.5" fill="var(--surface)" stroke="var(--grad-2)" strokeWidth="2" />
          <circle cx="26" cy="33" r="3.5" fill="var(--surface)" stroke="var(--grad-2)" strokeWidth="2" />
        </svg>
      ),
    },
    {
      n: "2",
      title: "See the rankings",
      desc: "Every car scored 1–10 by your priorities, ranked best-first",
      icon: (
        <svg width="32" height="32" viewBox="0 0 52 52" fill="none">
          <rect x="13" y="32" width="7" height="9" rx="2" fill="var(--grad-2)" opacity="0.35" />
          <rect x="22.5" y="25" width="7" height="16" rx="2" fill="var(--grad-2)" opacity="0.65" />
          <rect x="32" y="16" width="7" height="25" rx="2" fill="var(--grad-2)" />
          <path d="M14 27l9.5-7 9 4 7-10" stroke="var(--grad-3)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      n: "3",
      title: "Open the best ad",
      desc: "One click takes you to the listing on the original platform",
      icon: (
        <svg width="32" height="32" viewBox="0 0 52 52" fill="none">
          <rect x="13" y="17" width="18" height="16" rx="3.5" stroke="var(--grad-2)" strokeWidth="2.2" fill="none" />
          <path d="M24 17v-3.5M24 13.5h14v14M38 13.5L27 24.5" stroke="var(--grad-3)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: "100%", background: "var(--surface)", padding: "40px 32px" }}>
      <div className="text-center" style={{ marginBottom: 40 }}>
        <div className="text-[11px] font-bold uppercase" style={{ letterSpacing: 2, color: "var(--mid)" }}>
          How to use RankAutos
        </div>
      </div>
      <div className="flex flex-col gap-4" style={{ maxWidth: 420, width: "100%" }}>
        {steps.map((s) => (
          <div
            key={s.n}
            className="flex items-center gap-5 rounded-2xl"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "20px 22px" }}
          >
            <div className="relative flex-shrink-0">
              <div className="tile-soft flex items-center justify-center rounded-2xl" style={{ width: 68, height: 68 }}>
                {s.icon}
              </div>
              <div
                className="absolute flex items-center justify-center rounded-full font-extrabold text-white text-[13px] gradient-brand"
                style={{ top: -8, right: -8, width: 26, height: 26, boxShadow: "0 2px 8px rgba(124,58,237,0.4)" }}
              >
                {s.n}
              </div>
            </div>
            <div>
              <div className="text-base font-bold" style={{ marginBottom: 5 }}>
                {s.title}
              </div>
              <div className="text-sm" style={{ color: "var(--mid)", lineHeight: 1.6 }}>
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
