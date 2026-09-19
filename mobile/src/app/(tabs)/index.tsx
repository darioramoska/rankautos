import React from "react";
import { useRouter } from "expo-router";
import { DashboardScreen } from "../../screens/DashboardScreen";

export default function HomeRoute() {
  const router = useRouter();
  return (
    <DashboardScreen
      onOpenCar={(carId) => router.push({ pathname: "/car-detail", params: { carId: String(carId) } })}
      onBrowse={() => router.navigate("/results")}
    />
  );
}
