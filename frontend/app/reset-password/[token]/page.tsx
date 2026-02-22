"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import API from "@/lib/api";
import { Eye, EyeClosed } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      return showToast("Passwords do not match.", "error");
    }

    try {
      setLoading(true);

      const res = await API.patch(`/auth/reset-password/${token}`, {
        password,
      });
      showToast(`${res.data.message}`, "success");
      router.push("/login");
    } catch (err: any) {
      showToast(
        `${
          err?.response?.data?.message ||
          "Something went wrong. Please try again."
        }`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-black text-center">
          Reset Password
        </h2>

        <p className="text-sm text-gray-600 text-center mt-2 mb-6">
          Enter your new password below
        </p>

        {/* Password Field */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-2">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-gray-500 hover:text-black"
          >
            {showConfirm ? <EyeClosed size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Match Indicator */}
        {confirmPassword && (
          <p
            className={`text-xs mt-2 ${
              passwordsMatch ? "text-green-600" : "text-red-500"
            }`}
          >
            {passwordsMatch ? "" : "Passwords do not match"}
          </p>
        )}

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={loading || !passwordsMatch}
          className="mt-6 w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
