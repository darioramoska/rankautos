import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";
import { CAR_DATA } from "../lib/data";
import { useWeights } from "../lib/useWeights";
import { PlatformListingsScreen } from "../screens/PlatformListingsScreen";

export default function PlatformListingsRoute() {
  const router = useRouter();
  const { carId, platformId } = useLocalSearchParams<{ carId?: string; platformId?: string }>();
  const { weights } = useWeights();
  const car = CAR_DATA.find((c) => c.id === Number(carId));
  const listing = car?.listings.find((l) => l.name === platformId);

  if (!car || !listing) return <Text style={{ padding: 24 }}>Listings not found.</Text>;

  const platform = { name: listing.name, url: listing.url, flag: listing.flag };

  return <PlatformListingsScreen car={car} platform={platform} weights={weights} onClose={() => router.back()} />;
}
