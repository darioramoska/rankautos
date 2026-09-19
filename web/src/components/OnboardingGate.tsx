"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Onboarding } from "./Onboarding";
import { ONBOARDING_SEEN_KEY } from "@/lib/onboarding";

export function OnboardingGate() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDING_SEEN_KEY)) setShow(true);
    } catch {
      // localStorage unavailable — skip onboarding rather than block the app.
    }
  }, []);

  if (!show) return null;

  return (
    <Onboarding
      onDone={() => {
        setShow(false);
        router.push("/");
      }}
    />
  );
}
