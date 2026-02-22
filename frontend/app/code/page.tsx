import { Suspense } from "react";
import CodePageClient from "./CodePageClient";
import DashboardLayout from "@/components/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <CodePageClient />
      </Suspense>
    </DashboardLayout>
  );
}
