import { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { colors } from "../lib/theme";
import { AuthProvider } from "../lib/auth/AuthProvider";
import { FiltersProvider } from "../lib/useFilters";
import { FavoritesProvider } from "../lib/useFavorites";
import { Onboarding } from "../components/Onboarding";

const ONBOARDING_SEEN_KEY = "rankautos.onboarding_seen";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_SEEN_KEY)
      .then((seen) => setShowOnboarding(!seen))
      .catch(() => setShowOnboarding(false))
      .finally(() => setOnboardingChecked(true));
  }, []);

  if (!fontsLoaded || !onboardingChecked) return null;

  const finishOnboarding = () => {
    AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "1").catch(() => {});
    setShowOnboarding(false);
  };

  return (
    <AuthProvider>
      <FiltersProvider>
        <FavoritesProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="help" />
              <Stack.Screen name="disclaimer" />
              <Stack.Screen name="car-detail" options={{ presentation: "modal" }} />
              <Stack.Screen name="platform-listings" options={{ presentation: "modal" }} />
            </Stack>
            {showOnboarding && <Onboarding onDone={finishOnboarding} />}
          </View>
        </FavoritesProvider>
      </FiltersProvider>
    </AuthProvider>
  );
}
