"use client";

import API from "@/lib/api";
import { useEffect, useState } from "react";

type UserStats = {
  currentStreak: number;
  points: number;
};

export default function UserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/auth/stats");

        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">
          Your Progress
        </h2>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Streak Card */}
            <div className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-orange-500 to-blue-500 transition-transform duration-300 hover:scale-[1.02]">
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-500">
                    🔥 {stats?.currentStreak}
                  </p>
                </div>

                <div className="text-sm text-gray-400">Keep it going!</div>
              </div>
            </div>

            {/* Points Card */}
            <div className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-orange-500 to-blue-500 transition-transform duration-300 hover:scale-[1.02]">
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Total Points</p>
                  <p className="text-3xl font-bold text-blue-500">
                    ⭐ {stats?.points}
                  </p>
                </div>

                <div className="text-sm text-gray-400">Level up 🚀</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
