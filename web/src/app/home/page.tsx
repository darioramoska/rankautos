import { DashboardScreen } from "@/components/DashboardScreen";
import { getCars } from "@/lib/getCars";

export default async function HomePage() {
  const cars = await getCars();
  return <DashboardScreen cars={cars} />;
}
