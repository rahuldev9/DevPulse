// app/page.tsx

export const dynamic = "force-dynamic"; // ✅ ADD THIS

import { cookies } from "next/headers";
import HomeClient from "@/components/Homeclient";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return <HomeClient token={token} />;
}
