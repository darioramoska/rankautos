import { ResultsScreen } from "@/components/ResultsScreen";
import { getCars } from "@/lib/getCars";

export default async function ResultsPage() {
  const cars = await getCars();
  return <ResultsScreen cars={cars} />;
}
