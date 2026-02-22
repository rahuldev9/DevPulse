"use client";

import { useRouter } from "next/navigation";
import Logo from "./Logo";

type NavbarProps = {
  token?: string;
};

export default function Navbar({ token }: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
      <div className="px-6 md:px-12 py-4 flex justify-between items-center">
        <div onClick={() => router.push("/")} className="cursor-pointer">
          <Logo />
        </div>

        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="text-sm font-medium text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-500 hover:to-blue-600 transition"
              >
                Sign In
              </button>

              <button
                onClick={() => router.push("/register")}
                className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition shadow-md"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition shadow-md"
              >
                Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
