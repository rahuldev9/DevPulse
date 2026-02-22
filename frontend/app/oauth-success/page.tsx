"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function OAuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500); // small delay for smooth UX
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md text-center"
      >
        {/* Logo / Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {/* Pulse Ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-blue-600 opacity-75 animate-ping"></span>

          {/* Soft Glow Ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-blue-600 blur-xl opacity-40"></span>

          {/* Logo Container */}
          <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Logo />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Signing You In...
        </h2>

        <p className="text-gray-500 text-sm">
          Please wait while we securely log you into your account.
        </p>
      </motion.div>
    </div>
  );
}
