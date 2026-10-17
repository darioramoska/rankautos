"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { AuthForm } from "./AuthForm";

function MenuRow({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "16px 18px" }}
    >
      <div className="flex items-center justify-center rounded-full tile-soft" style={{ width: 34, height: 34, flexShrink: 0 }}>
        {icon}
      </div>
      <span className="font-semibold text-sm flex-1">{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3l5 5-5 5" stroke="var(--mid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export function ProfileScreen() {
  const { user, loading, configured, signOut } = useAuth();

  return (
    <div className="min-h-screen lg:flex lg:items-start lg:gap-8 lg:mx-auto" style={{ maxWidth: 1040 }}>
      {/* On desktop this becomes a vertical card pinned to the left, instead of a full-width
          band above the account content — so the account details start near the top of the
          viewport rather than being pushed down by a tall banner. */}
      <div
        className="gradient-hero relative lg:rounded-3xl lg:flex-shrink-0 lg:self-start lg:sticky lg:top-6"
        style={{ padding: "60px 32px 44px", overflow: "hidden" }}
      >
        <div className="absolute rounded-full gradient-blob-warm" style={{ width: 260, height: 260, right: -60, top: -40, opacity: 0.35, filter: "blur(30px)" }} />
        <div className="mx-auto lg:mx-0 lg:w-[260px]" style={{ maxWidth: 480, position: "relative" }}>
          <div
            className="flex items-center justify-center rounded-full tile-glass"
            style={{ width: 56, height: 56, marginBottom: 16 }}
          >
            <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3.4" stroke="#fff" strokeWidth="1.8" />
              <path d="M3.5 17c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-bold text-white" style={{ fontSize: 24, marginBottom: 6 }}>
            {user ? `Hi, ${user.user_metadata?.display_name || user.email}` : "You're browsing as a guest"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.5 }}>
            {user
              ? "Manage your account below."
              : "Sign in to save searches, priority weights, and get price-drop alerts."}
          </p>
        </div>
      </div>

      <div className="mx-auto lg:mx-0 lg:flex-1" style={{ maxWidth: 480, padding: "28px 32px 100px" }}>
        {!configured ? (
          <div className="rounded-2xl text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24, color: "var(--mid)", fontSize: 13 }}>
            Accounts aren&apos;t configured yet.
          </div>
        ) : loading ? (
          <div className="text-center" style={{ color: "var(--mid)", fontSize: 13, padding: 24 }}>
            Loading…
          </div>
        ) : user ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 20, boxShadow: "var(--shadow)" }}>
              <div className="text-xs font-semibold" style={{ color: "var(--mid)", marginBottom: 4 }}>
                Email
              </div>
              <div className="font-semibold" style={{ marginBottom: 16 }}>
                {user.email}
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-full font-bold text-sm"
                style={{ padding: "10px 20px", border: "1.5px solid var(--border)", color: "var(--ink)" }}
              >
                Sign out
              </button>
            </div>
            <div className="rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 20 }}>
              <div className="font-bold text-sm" style={{ marginBottom: 10 }}>
                Coming soon
              </div>
              <ul className="flex flex-col gap-2 text-sm" style={{ color: "var(--mid)" }}>
                <li>• Save your filter presets and priority weights</li>
                <li>• Email alerts when a saved search&apos;s best price drops</li>
                <li>• Sync your rankings between web and the mobile app</li>
              </ul>
            </div>
          </div>
        ) : (
          <AuthForm />
        )}

        <div className="flex flex-col gap-3" style={{ marginTop: 20 }}>
          <MenuRow
            href="/help"
            label="Help"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.2" stroke="var(--grad-2)" strokeWidth="1.5" />
                <path d="M6.2 6.3c.2-1 1-1.6 1.9-1.6 1.1 0 2 .7 2 1.7 0 .9-.6 1.3-1.3 1.7-.6.4-.8.7-.8 1.3" stroke="var(--grad-2)" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="8" cy="11.3" r="0.15" stroke="var(--grad-2)" strokeWidth="1.5" />
              </svg>
            }
          />
          <MenuRow
            href="/disclaimer"
            label="Disclaimer"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5l6.2 3.4v6.2L8 14.5l-6.2-3.4V4.9L8 1.5Z" stroke="var(--grad-2)" strokeWidth="1.4" strokeLinejoin="round" />
                <line x1="8" y1="6" x2="8" y2="9" stroke="var(--grad-2)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.2" stroke="var(--grad-2)" strokeWidth="1.5" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
