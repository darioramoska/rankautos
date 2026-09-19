"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1.5px solid var(--border)",
  fontSize: 14,
  fontFamily: "inherit",
  color: "var(--ink)",
  background: "var(--surface)",
};

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (mode === "signup" && !gdprConsent) {
      setError("Please agree to the privacy policy to create an account.");
      return;
    }
    setBusy(true);
    const result =
      mode === "signin" ? await signIn(email, password) : await signUp(email, password, displayName, gdprConsent);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      setInfo("Check your email to confirm your account, then sign in.");
      setMode("signin");
    }
  };

  return (
    <div className="rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)" }}>
      <div className="flex items-center gap-2 rounded-full" style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: 3, marginBottom: 20, width: "fit-content" }}>
        {(["signin", "signup"] as const).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setInfo(null);
              }}
              className={`text-xs font-semibold rounded-full transition-all duration-150 ${active ? "gradient-brand text-white" : ""}`}
              style={{ padding: "7px 18px", color: active ? "#fff" : "var(--mid)" }}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--mid)" }}>
              Name
            </label>
            <input
              style={{ ...inputStyle, marginTop: 6 }}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold" style={{ color: "var(--mid)" }}>
            Email
          </label>
          <input
            style={{ ...inputStyle, marginTop: 6 }}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-xs font-semibold" style={{ color: "var(--mid)" }}>
            Password
          </label>
          <input
            style={{ ...inputStyle, marginTop: 6 }}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
        </div>

        {mode === "signup" && (
          <label className="flex items-start gap-2 text-xs" style={{ color: "var(--mid)", marginTop: 2 }}>
            <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} style={{ marginTop: 2 }} />
            I agree to the privacy policy and consent to my data being processed to create an account.
          </label>
        )}

        {error && (
          <div className="text-xs font-semibold" style={{ color: "var(--red)" }}>
            {error}
          </div>
        )}
        {info && (
          <div className="text-xs font-semibold" style={{ color: "var(--green)" }}>
            {info}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="gradient-brand text-white font-bold rounded-2xl"
          style={{ padding: "12px 20px", marginTop: 6, opacity: busy ? 0.7 : 1 }}
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
