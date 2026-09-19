import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { OnboardingGate } from "@/components/OnboardingGate";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { FavoritesProvider } from "@/lib/useFavorites";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "RankAutos — Find Your Perfect Car",
  description:
    "Pan-European car comparison and ranking platform. Aggregates listings from 10+ EU marketplaces and scores them across 7 criteria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          <FavoritesProvider>
            {children}
            <BottomNav />
            <OnboardingGate />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
