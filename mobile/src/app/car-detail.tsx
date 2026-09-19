import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";
import { CAR_DATA } from "../lib/data";
import { getCars } from "../lib/getCars";
import { useFilters } from "../lib/useFilters";
import type { CarModel } from "../lib/types";
import { CarDetailScreen } from "../screens/CarDetailScreen";

export default function CarDetailRoute() {
  const router = useRouter();
  const { carId } = useLocalSearchParams<{ carId?: string }>();
  const { filters } = useFilters();
  // Same live/mock fallback as ResultsScreen — starts from the mock catalog (so this
  // still works if someone deep-links here before Results has ever fetched) and swaps
  // to live data once it resolves. IDs are generated in lockstep with the mock data,
  // so a mock-sourced id always resolves correctly either way.
  const [cars, setCars] = useState<CarModel[]>(CAR_DATA);

  useEffect(() => {
    let cancelled = false;
    getCars().then((data) => {
      if (!cancelled) setCars(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const car = cars.find((c) => c.id === Number(carId));

  if (!car) return <Text style={{ padding: 24 }}>Car not found.</Text>;

  return (
    <CarDetailScreen
      car={car}
      platformFilter={filters.platforms}
      onClose={() => router.back()}
      onOpenPlatform={(platform) =>
        router.push({
          pathname: "/platform-listings",
          params: { carId: String(car.id), platformId: platform.name },
        })
      }
    />
  );
}
