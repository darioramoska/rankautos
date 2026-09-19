"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type TabId = "home" | "filters" | "criteria" | "rankings" | "profile";

interface Tab {
  id: TabId;
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactElement;
}

const TABS: Tab[] = [
  {
    id: "home",
    label: "Home",
    href: "/home",
    icon: (active) => (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 9.5L10 4l6 5.5V16a1 1 0 01-1 1h-3v-5H8v5H5a1 1 0 01-1-1V9.5z"
          stroke={active ? "#fff" : "rgba(255,255,255,0.55)"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "filters",
    label: "Filters",
    href: "/",
    icon: (active) => (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 5.5h14M6 10h8M9 14.5h2"
          stroke={active ? "#fff" : "rgba(255,255,255,0.55)"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "criteria",
    label: "Criteria",
    href: "/results#criteria",
    icon: (active) => {
      const c = active ? "#fff" : "rgba(255,255,255,0.55)";
      return (
        <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
          <line x1="5" y1="3" x2="5" y2="17" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="5" cy="7.5" r="2" fill={c} />
          <line x1="10" y1="3" x2="10" y2="17" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="13" r="2" fill={c} />
          <line x1="15" y1="3" x2="15" y2="17" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="15" cy="5.5" r="2" fill={c} />
        </svg>
      );
    },
  },
  {
    id: "rankings",
    label: "Rankings",
    href: "/results#rankings",
    icon: (active) => (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 15V9M10 15V5M16 15v-3.5"
          stroke={active ? "#fff" : "rgba(255,255,255,0.55)"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: (active) => {
      const c = active ? "#fff" : "rgba(255,255,255,0.55)";
      return (
        <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.2" stroke={c} strokeWidth="1.8" />
          <path d="M3.5 17c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    },
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [pathname]);

  const active: TabId =
    pathname === "/results"
      ? hash === "#criteria"
        ? "criteria"
        : "rankings"
      : pathname === "/profile"
        ? "profile"
        : pathname === "/home"
          ? "home"
          : "filters";

  const handleClick = (e: React.MouseEvent, tab: Tab) => {
    if (tab.id === "home" || tab.id === "filters" || tab.id === "profile" || pathname !== "/results") return;
    // Already on the results page — scroll smoothly instead of a full navigation.
    e.preventDefault();
    document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${tab.id}`);
    setHash(`#${tab.id}`);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}
    >
      <div
        className="flex items-center gap-1 rounded-full pointer-events-auto"
        style={{
          background: "rgba(25, 10, 62, 0.88)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "var(--shadow-lg)",
          padding: 6,
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={(e) => handleClick(e, tab)}
              className="flex items-center gap-2 rounded-full transition-all duration-150"
              style={{
                padding: "10px 16px",
                background: isActive ? "linear-gradient(135deg, var(--grad-2) 0%, var(--grad-3) 100%)" : "transparent",
              }}
            >
              {tab.icon(isActive)}
              <span className="text-xs font-semibold" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
