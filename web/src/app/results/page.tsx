import { ResultsScreen } from "@/components/ResultsScreen";
import { getCars } from "@/lib/getCars";

// Re-fetch the catalog from Supabase at most every 5 minutes (Next would otherwise cache the fetch indefinitely).
export const revalidate = 300;

export default async function ResultsPage() {
  const cars = await getCars();
  return <ResultsScreen cars={cars} />;
}
