"use client";

import { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children?: ReactNode;

  autoClose?: boolean;
  showSidebar?: boolean;
  onSidebarOpen?: (isOpen: true) => void;
}

export default function DashboardLayout({
  children,

  autoClose,
  onSidebarOpen,
  showSidebar = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  // Notify parent when sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      onSidebarOpen?.(true);
    }
  }, [sidebarOpen, onSidebarOpen]);

  // Handle autoClose correctly
  useEffect(() => {
    if (autoClose) {
      setShouldAutoClose(true);
    }
  }, [autoClose]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div
          className={`hidden md:block h-full border-r border-slate-200/60 bg-white/50 backdrop-blur-xl z-30 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <Sidebar onToggle={setSidebarOpen} autoClose={shouldAutoClose} />
        </div>
      )}

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="md:hidden">
          <Sidebar />
        </div>
      )}

      {/* Main Content (always full width when sidebar hidden) */}
      <div className="flex-1 flex flex-col h-full overflow-auto pt-4 lg:pt-4 pb-14">
        {children}
      </div>
    </div>
  );
}
