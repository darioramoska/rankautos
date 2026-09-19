"use client";

import { useRouter } from "next/navigation";
import { HomeScreen } from "@/components/HomeScreen";
import { useFilters } from "@/lib/useFilters";

export default function Home() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();

  return <HomeScreen filters={filters} setFilters={setFilters} onStart={() => router.push("/results")} />;
}
