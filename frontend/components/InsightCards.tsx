"use client";

import { BarChart3, Code2, Trophy } from "lucide-react";

interface Props {
  totalSubmissions: number;
  languageUsage: Record<string, number>;
  mostUsedLanguage: string | null;
}

export default function InsightCards({
  totalSubmissions,
  languageUsage,
  mostUsedLanguage,
}: Props) {
  const hasLanguages = Object.keys(languageUsage).length > 0;

  const getPercentage = (count: number) => {
    if (!totalSubmissions) return 0;
    return Math.round((count / totalSubmissions) * 100);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {/* Total Submissions */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Total Submissions</h3>
          <BarChart3 />
        </div>
        <p className="text-4xl font-bold mt-4">{totalSubmissions}</p>
      </div>

      {/* Most Used Language */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Most Used Language</h3>
          <Trophy />
        </div>
        <p className="text-3xl font-bold mt-4 capitalize">
          {mostUsedLanguage || "N/A"}
        </p>
      </div>

      {/* Language Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Language Breakdown
          </h3>
          <Code2 className="text-gray-500" />
        </div>

        {hasLanguages ? (
          <div className="space-y-4">
            {Object.entries(languageUsage).map(([lang, count]) => {
              const percentage = getPercentage(count);

              return (
                <div key={lang}>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="capitalize">{lang}</span>
                    <span>
                      {count} ({percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-in-out"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No submissions yet.</p>
        )}
      </div>
    </div>
  );
}
