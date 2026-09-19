import React from "react";
import { useRouter } from "expo-router";
import { DisclaimerScreen } from "../screens/DisclaimerScreen";

export default function DisclaimerRoute() {
  const router = useRouter();
  return <DisclaimerScreen onBack={() => router.back()} />;
}
