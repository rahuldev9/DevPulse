"use client";

import { redirect, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
type HomeClientProps = {
  token: string | undefined;
};

export default function HomeClient({ token }: HomeClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar token={token} />

      {/* ================= HERO ================= */}
      <section className="px-6 md:px-12 py-24 text-center bg-gradient-to-br from-orange-500 to-blue-600 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight"
        >
          Code in Any Language.
          <br className="hidden md:block" />
          Track Your Daily Progress.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg opacity-90"
        >
          Write code, solve challenges, and monitor your streaks — all inside
          one powerful developer platform.
        </motion.p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {token ? (
            // ✅ If logged in → show Dashboard button
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Go to Dashboard
            </button>
          ) : (
            // ❌ If not logged in → show auth buttons
            <>
              <button
                onClick={() => router.push("/register")}
                className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Create Account
              </button>

              <button
                onClick={() => router.push("/login")}
                className="px-8 py-3 border border-white rounded-xl font-medium hover:bg-white/20 transition"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </section>

      {/* ================= CODE EDITOR PREVIEW ================= */}
      <section className="px-6 md:px-12 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>

          <pre className="text-left text-sm sm:text-base text-green-400 p-6 overflow-x-auto">
            {`// Python Example
def greet(name):
    return f"Hello, {name} 👋"

print(greet("Developer"))`}
          </pre>
        </div>
      </section>

      {/* ================= VISUAL STATS ================= */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "25+", label: "Languages Supported" },
            { value: "14 Days", label: "Current Streak" },
            { value: "120+", label: "Problems Solved" },
            { value: "98%", label: "Progress Rate" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-100"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="py-24 px-6 md:px-12 text-center bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold">
          Visualize Your Growth
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Track coding time, streaks, and performance metrics in a clean and
          powerful dashboard.
        </p>

        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-7 gap-2">
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className={`h-6 rounded ${
                  i % 5 === 0
                    ? "bg-orange-500"
                    : i % 3 === 0
                      ? "bg-blue-400"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Daily activity heatmap preview
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-r from-orange-500 to-blue-600 py-20 text-center text-white px-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Start Coding?
        </h2>
        <p className="mt-4 opacity-90">
          Join thousands of developers improving every day.
        </p>
        <button
          onClick={() => router.push("/register")}
          className="mt-8 px-10 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-100 transition shadow-lg"
        >
          Create Free Account
        </button>
      </section>
      {/* <AllSubmissionsList /> */}
    </div>
  );
}
