import React from "react";
import { useRouter } from "expo-router";
import { ResultsScreen } from "../../screens/ResultsScreen";

export default function ResultsRoute() {
  const router = useRouter();

  return (
    <ResultsScreen
      onBack={() => router.navigate("/filters")}
      onOpenCar={(carId) => router.push({ pathname: "/car-detail", params: { carId: String(carId) } })}
    />
  );
}
