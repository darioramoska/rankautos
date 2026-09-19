import React from "react";
import { useRouter } from "expo-router";
import { HelpScreen } from "../screens/HelpScreen";

export default function HelpRoute() {
  const router = useRouter();
  return <HelpScreen onBack={() => router.back()} />;
}
