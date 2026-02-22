"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { showToast } from "@/components/Toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    // Name validation
    if (!form.name.trim()) {
      showToast("Full name is required.", "warning");
      return;
    }

    // Email validation
    if (!form.email.trim()) {
      showToast("Email is required.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast("Please enter a valid email address.", "warning");
      return;
    }

    // Password validation
    if (!form.password.trim()) {
      showToast("Password is required.", "warning");
      return;
    }

    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters.", "warning");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      showToast(res.data.message || "Registered successfully!", "success");
      router.push("/login");
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Something went wrong. Try again.",
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
          Create your account
        </h1>
        <p className="text-sm text-gray-500 text-center mt-2">
          Start coding and track your daily progress 🚀
        </p>

        {/* Form */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 
          focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, email: value });

                if (!value.trim()) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "Email is required.",
                  }));
                } else if (!isValidEmail(value)) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "Please enter a valid email address.",
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
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
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12
            focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-900 transition"
            >
              {show ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Primary Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white
        bg-gradient-to-r from-orange-500 to-blue-600
        hover:scale-[1.02] active:scale-[0.98]
        transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-xs text-gray-400 uppercase">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google Button */}
        <GoogleSignInButton />

        {/* Login Link */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
