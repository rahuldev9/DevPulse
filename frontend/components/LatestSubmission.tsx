"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Clock, Code2 } from "lucide-react";

interface Submission {
  _id: string;
  code: string;
  language: string;
  createdAt: string;
}

export default function LatestSubmission() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await API.get("/code/latest");
        setSubmission(res.data);
      } catch (error) {
        console.error("Failed to fetch latest submission");
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-2xl shadow">
        <p className="text-gray-500">Loading latest submission...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="mt-8 p-6 bg-white rounded-2xl shadow">
        <p className="text-gray-500">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Code2 size={18} />
          Latest Submission
        </h3>

        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Clock size={14} />
          {new Date(submission.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Language Badge */}
      <div className="mb-4">
        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 capitalize">
          {submission.language}
        </span>
      </div>

      {/* Code Preview */}
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-48">
        {submission.code.length > 300
          ? submission.code.substring(0, 300) + "..."
          : submission.code}
      </pre>
    </div>
  );
}
