import { DashboardScreen } from "@/components/DashboardScreen";
import { getCars } from "@/lib/getCars";

// Re-fetch the catalog from Supabase at most every 5 minutes (Next would otherwise cache the fetch indefinitely).
export const revalidate = 300;

export default async function HomePage() {
  const cars = await getCars();
  return <DashboardScreen cars={cars} />;
}
