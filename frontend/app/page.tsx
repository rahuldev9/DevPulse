// app/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeClient from "@/components/Homeclient";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // ✅ FIX

  // if (token) {
  //   redirect("/dashboard");
  // }

  return <HomeClient token={token} />;
}
