"use client";

import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const router = useRouter();

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/google`;
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-3 
                 bg-white border border-gray-300 
                 rounded-xl px-4 py-3 
                 shadow-sm hover:shadow-md 
                 transition-all duration-200 
                 active:scale-[0.98]"
    >
      {/* Google Logo */}
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.91-6.91C35.98 2.54 30.37 0 24 0 14.61 0 6.51 5.64 2.56 13.76l8.05 6.26C12.5 13.18 17.77 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.14 24.55c0-1.64-.15-3.21-.43-4.73H24v9.02h12.44c-.54 2.91-2.18 5.38-4.64 7.05l7.2 5.6C43.93 37.36 46.14 31.48 46.14 24.55z"
        />
        <path
          fill="#FBBC05"
          d="M10.61 28.01A14.49 14.49 0 0 1 9.5 24c0-1.39.24-2.74.67-4.01l-8.05-6.26A23.94 23.94 0 0 0 0 24c0 3.82.91 7.42 2.56 10.24l8.05-6.23z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.14 15.91-5.82l-7.2-5.6c-2 1.35-4.57 2.15-8.71 2.15-6.23 0-11.5-3.68-13.39-8.91l-8.05 6.23C6.51 42.36 14.61 48 24 48z"
        />
      </svg>

      <span className="text-sm font-medium text-gray-700">
        Continue with Google
      </span>
    </button>
  );
}
