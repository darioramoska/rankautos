import React from "react";
import { useRouter } from "expo-router";
import { useFilters } from "../../lib/useFilters";
import { HomeScreen } from "../../screens/HomeScreen";

export default function Home() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();

  return <HomeScreen filters={filters} setFilters={setFilters} onStart={() => router.push("/results")} />;
}
