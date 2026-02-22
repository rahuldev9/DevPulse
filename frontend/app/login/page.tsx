"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { showToast } from "@/components/Toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    if (!form.email.trim()) {
      showToast("Email is required!", "warning");
      return;
    }

    if (!form.password.trim()) {
      showToast("Password is required!", "warning");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      showToast(`${res.data.message}`, "success");
      router.push("/dashboard");
    } catch (err: any) {
      showToast(
        `${err?.response?.data?.message || "Invalid credentials."}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email: form.email,
      });

      showToast(`${res.data.message}`, "success");
    } catch (err: any) {
      // setError(err?.response?.data?.message || "Unable to send reset link.");
      showToast(
        `${err?.response?.data?.message || "Unable to send reset link."}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 px-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {forgotMode ? "Reset Password" : "Welcome Back 👋"}
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          {forgotMode
            ? "Enter your email to receive reset link."
            : "Login to continue coding."}
        </p>

        {/* Email */}
        <div className="mt-6">
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, email: value });

              if (!value) {
                setErrors({ email: "Email is required." });
              } else if (!isValidEmail(value)) {
                setErrors({ email: "Enter a valid email address." });
              } else {
                setErrors({ email: "" });
              }
            }}
            className={`w-full border rounded-xl px-4 py-3 transition 
          focus:outline-none focus:ring-2
          ${
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-orange-500"
          }`}
          />
        </div>

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

        {/* Password */}
        {!forgotMode && (
          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 
            focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-900 transition"
            >
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {/* Primary Button */}
        <button
          onClick={forgotMode ? forgotPassword : login}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white 
        bg-gradient-to-r from-orange-500 to-blue-600 
        hover:scale-[1.02] active:scale-[0.98]
        transition-all shadow-lg disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : forgotMode
              ? "Send Reset Link"
              : "Login"}
        </button>

        {/* Divider */}
        {!forgotMode && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-xs text-gray-400 uppercase">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <GoogleSignInButton />
          </>
        )}

        {/* Toggle Links */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          {!forgotMode ? (
            <>
              <p
                onClick={() => setForgotMode(true)}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Forgot Password?
              </p>

              <p>
                Don’t have an account?{" "}
                <span
                  onClick={() => router.push("/register")}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Create Account
                </span>
              </p>
            </>
          ) : (
            <p
              onClick={() => setForgotMode(false)}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Back to Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
