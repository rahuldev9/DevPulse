"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Code2, Trash2, Calendar, Loader2 } from "lucide-react";
import { showConfirm } from "./ConfirmModal";
import { useRouter } from "next/navigation";
import { showToast } from "./Toast";

interface SavedCode {
  _id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
}

interface ApiResponse {
  count: number;
  savedCodes: SavedCode[];
}

export default function SavedCodesList() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const fetchCodes = async () => {
    try {
      const res = await API.get<ApiResponse>("/code/saved");
      setCodes(res.data.savedCodes);
    } catch (error) {
      console.error("Failed to fetch saved codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = await showConfirm(
      "Are you sure you want to delete this saved code?",
      "warning",
    );

    if (!ok) return;

    try {
      setDeletingId(id);
      const res = await API.delete(`/code/saved/${id}`);
      showToast(`${res.data.message}`, "success");
      setCodes((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      showToast(`${err?.response?.data?.message || "Delete failed"}`, "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-2xl shadow flex items-center gap-2">
        <Loader2 className="animate-spin" size={18} />
        <p className="text-gray-500">Loading saved codes...</p>
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white rounded-2xl shadow text-gray-500">
        No saved codes yet.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {codes.map((item) => (
        <div
          key={item._id}
          onClick={() => router.push(`/code?id=${item._id}`)}
          className="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition cursor-pointer"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code2 size={18} />
                {item.title}
              </h3>

              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 capitalize">
                  {item.language}
                </span>

                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item._id);
              }}
              className="text-red-500 hover:text-red-700 transition"
              disabled={deletingId === item._id}
            >
              {deletingId === item._id ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          </div>

          {/* Code Preview */}
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-48">
            {item.code.length > 400
              ? item.code.substring(0, 400) + "..."
              : item.code}
          </pre>
        </div>
      ))}
    </div>
  );
}
