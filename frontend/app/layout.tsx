import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevPulse",
    template: "%s | DevPulse",
  },
  description:
    "DevPulse is a modern coding platform that lets developers write, run, and analyze code with powerful execution insights and real-time analytics.",
  keywords: [
    "DevPulse",
    "Online Coding Platform",
    "Code Execution",
    "Developer Analytics",
    "Programming Dashboard",
    "Code Insights",
    "Developer Tools",
  ],
  authors: [{ name: "DevPulse Team" }],
  creator: "DevPulse",
  icons: {
    icon: "/favicon.ico", // put favicon inside public folder
  },
  openGraph: {
    title: "DevPulse - Code. Run. Analyze.",
    description:
      "Write code, execute instantly, and track your programming insights with DevPulse.",
    url: "http://localhost:3000",
    siteName: "DevPulse",
    type: "website",
  },
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
