"use client";

import { useEffect, useState, useMemo } from "react";
import API from "@/lib/api";
import { Code2, Calendar, Trophy, Medal, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getUserProfile } from "@/contexts/AuthDetails";
import { showConfirm } from "@/components/ConfirmModal";
import { showToast } from "@/components/Toast";

/* ================= TYPES ================= */

interface UserType {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Submission {
  _id: string;
  user: UserType;
  code: string;
  language: string;
  createdAt: string;
  timeTaken?: number;
}

/* ================= COMPONENT ================= */

export default function LeaderboardAndSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CURRENT USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        setCurrentUserId(data._id);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  /* ================= FETCH SUBMISSIONS ================= */

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get("/code/submissions");
        setSubmissions(res.data.submissions || []);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  /* ================= LEADERBOARD LOGIC ================= */

  const leaderboard = useMemo(() => {
    const map: Record<
      string,
      { user: UserType; count: number; totalTime: number }
    > = {};

    submissions.forEach((item) => {
      const userId = item.user._id;

      if (!map[userId]) {
        map[userId] = {
          user: item.user,
          count: 0,
          totalTime: 0,
        };
      }

      map[userId].count += 1;
      map[userId].totalTime += item.timeTaken || 0;
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [submissions]);

  /* ================= DELETE HANDLER ================= */

  const handleDelete = async (id: string) => {
    const confirmDelete = await showConfirm(
      "Are you sure you want to delete this submission?",
      "danger",
    );

    if (!confirmDelete) return;

    try {
      const res = await API.delete(`/code/submission/${id}`);
      showToast(res.data.message || "Deleted", "success");

      setSubmissions((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Delete failed", "error");
    }
  };

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : (
          <>
            {/* ================= LEADERBOARD ================= */}

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <Trophy size={20} /> Leaderboard
              </h2>

              {leaderboard.length === 0 ? (
                <p className="text-gray-500 text-sm">No submissions yet.</p>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.user._id}
                      className="flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition"
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="text-lg font-bold w-6 flex justify-center">
                          {index === 0 && <Medal className="text-yellow-500" />}
                          {index === 1 && <Medal className="text-gray-400" />}
                          {index === 2 && <Medal className="text-orange-500" />}
                          {index > 2 && index + 1}
                        </div>

                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white flex items-center justify-center font-semibold overflow-hidden text-lg">
                          {entry.user.avatar ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACKEND_API}${entry.user.avatar}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            entry.user.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        {/* User Info */}
                        <div>
                          <p className="font-medium">{entry.user.name}</p>
                          <p className="text-sm text-gray-500 break-all">
                            {entry.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{entry.count}</span>{" "}
                        submissions
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= SUBMISSIONS ================= */}

            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Code2 size={20} /> All Submissions
              </h2>

              {submissions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No submissions available.
                </p>
              ) : (
                submissions.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition p-6"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.user.name}
                        </p>
                        <p className="text-sm text-gray-500 break-all">
                          {item.user.email}
                        </p>
                      </div>

                      {currentUserId === item.user._id && (
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-3">
                      <span className="capitalize bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {item.language}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleString()}
                      </span>

                      {item.timeTaken && <span>⏱ {item.timeTaken}s</span>}
                    </div>

                    {/* Code */}
                    <div className="bg-gray-900 rounded-xl p-4 mt-4 overflow-hidden">
                      <pre className="text-green-400 text-xs sm:text-sm font-mono overflow-x-auto max-h-60 leading-relaxed">
                        {item.code.length > 500
                          ? item.code.substring(0, 500) + "..."
                          : item.code}
                      </pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
