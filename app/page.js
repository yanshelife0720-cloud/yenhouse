import { getSiteData } from "@/lib/data";
import HomePage from "@/components/HomePage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getSiteData();
  return <HomePage data={data} />;
}
