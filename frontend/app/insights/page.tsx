"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import ChartAnalytics from "@/components/ChartAnalytics";
import { BarChart3, Flame, Code2 } from "lucide-react";

interface Insights {
  totalSubmissions: number;
  totalLines: number;
  totalTime: number;
  averageTime: number;
  mostUsedLanguage: string | null;
  languageStats: Record<string, number>;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get("/code/insights");
        setInsights(res.data);
      } catch (error) {
        console.error("Failed to fetch insights", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <DashboardLayout>
      <div className="px-6 md:px-10 pb-10">
        {/* 🔥 Gradient Header */}
        <div className="mb-10 rounded-2xl p-8 bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} />
            <h1 className="text-3xl font-bold">Code Insights</h1>
          </div>
          <p className="mt-2 text-sm opacity-90">
            Visual breakdown of your programming activity.
          </p>
        </div>

        {/* 📊 Stats Cards */}
        {!loading && insights && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Total Submissions */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-orange-500">
                <Code2 />
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Submissions
                </h3>
              </div>
              <p className="text-3xl font-bold mt-4 text-gray-900">
                {insights.totalSubmissions}
              </p>
            </div>

            {/* Most Used Language */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-blue-600">
                <Flame />
                <h3 className="text-lg font-semibold text-gray-800">
                  Most Used Language
                </h3>
              </div>
              <p className="text-3xl font-bold mt-4 capitalize text-gray-900">
                {insights.mostUsedLanguage || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* 📈 Chart Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 md:p-8 min-h-[400px]">
          {loading ? (
            <ChartSkeleton />
          ) : insights?.languageStats &&
            Object.keys(insights.languageStats).length > 0 ? (
            <ChartAnalytics languageUsage={insights.languageStats} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
              No analytics data available.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-full bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
