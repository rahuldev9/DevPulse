"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import InsightCards from "@/components/InsightCards";
import { Trophy } from "lucide-react";
import SavedCodesList from "@/components/SavedCodesList";

interface Insights {
  totalSubmissions: number;
  totalLines: number;
  totalTime: number;
  averageTime: number;
  languageStats: Record<string, number>;
  dailyChallenge?: {
    title: string;
    difficulty: string;
  };
  leaderboardPreview?: {
    name: string;
    points: number;
  }[];
  upcomingContest?: {
    name: string;
  };
}

export default function Dashboard() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/code/insights");
      setInsights(res.data);
    } catch (error) {
      console.error("Failed to fetch insights", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const computeMostUsedLanguage = (
    stats: Record<string, number>,
  ): string | null => {
    if (!stats || Object.keys(stats).length === 0) return null;

    return Object.entries(stats).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <DashboardLayout>
      <div className="px-6 md:px-10 pb-16">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Overview of your coding journey 🚀
          </p>
        </div>

        {/* INSIGHT CARDS */}
        <div className="mb-12">
          {loading ? (
            <InsightSkeleton />
          ) : (
            insights && (
              <InsightCards
                totalSubmissions={insights.totalSubmissions || 0}
                languageUsage={insights.languageStats || {}}
                mostUsedLanguage={computeMostUsedLanguage(
                  insights.languageStats || {},
                )}
              />
            )
          )}
        </div>

        {/* DAILY CHALLENGE */}
        {!loading && insights?.dailyChallenge && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl mb-12 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Daily Challenge</h2>
            <p className="text-lg font-medium">
              {insights.dailyChallenge.title}
            </p>
            <p className="text-sm opacity-80 mt-1">
              Difficulty: {insights.dailyChallenge.difficulty}
            </p>
            <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-xl font-medium hover:opacity-90 transition">
              Start Now
            </button>
          </div>
        )}

        {/* LEADERBOARD */}
        {!loading && insights?.leaderboardPreview && (
          <div className="bg-white rounded-2xl border shadow-sm p-6 mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={18} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Leaderboard Preview</h2>
            </div>

            {insights.leaderboardPreview.map((user, i) => (
              <div
                key={i}
                className="flex justify-between py-3 border-b last:border-none"
              >
                <span>{user.name}</span>
                <span className="font-medium">{user.points} pts</span>
              </div>
            ))}
          </div>
        )}

        {/* UPCOMING CONTEST */}
        {!loading && insights?.upcomingContest && (
          <div className="bg-white rounded-2xl border shadow-sm p-6 mb-12">
            <h2 className="text-lg font-semibold mb-2">Upcoming Contest</h2>
            <p className="text-gray-600">{insights.upcomingContest.name}</p>
            <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              Join Contest
            </button>
          </div>
        )}

        <SavedCodesList />
      </div>
    </DashboardLayout>
  );
}

function InsightSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border bg-white shadow-sm animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
