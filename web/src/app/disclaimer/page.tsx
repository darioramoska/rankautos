import Link from "next/link";
import { Disclaimer } from "@/components/info/Disclaimer";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", paddingBottom: 110 }}>
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto flex items-center" style={{ maxWidth: 860, padding: "16px 32px" }}>
          <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--mid)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="var(--mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to profile
          </Link>
        </div>
      </div>
      <div className="mx-auto" style={{ maxWidth: 860, padding: "24px 32px" }}>
        <h1 className="font-bold" style={{ fontSize: 22, marginBottom: 16 }}>
          Disclaimer
        </h1>
        <Disclaimer />
      </div>
    </div>
  );
}
