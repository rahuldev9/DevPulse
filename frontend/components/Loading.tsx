"use client";
import React from "react";

import Logo from "./Logo";

interface LoadingOverlayProps {
  isVisible?: boolean;
  Content?: string;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  Content = "",
  message = "Loading...",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      {/* Animated Logo Loader */}
      <div className="text-center text-white relative">
        <div className="relative mb-6 animate-pulse">
          <Logo />
        </div>

        {/* Text Animation */}
        <div className="space-y-2">
          {Content && <h2 className="text-2xl font-bold">{Content}</h2>}
          <p className="text-lg opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
