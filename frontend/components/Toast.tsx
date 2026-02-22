"use client";

import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "warning";

let toastRoot: any = null;

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999]"
      >
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
            ${
              type === "success"
                ? "bg-gradient-to-r from-orange-500 to-blue-600"
                : type === "error"
                  ? "bg-red-500"
                  : "bg-yellow-500 text-black"
            }`}
        >
          {type === "success" && <CheckCircle size={18} />}
          {type === "error" && <AlertCircle size={18} />}
          {type === "warning" && <AlertTriangle size={18} />}

          {message}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function showToast(message: string, type: ToastType = "success") {
  const container = document.createElement("div");
  document.body.appendChild(container);

  toastRoot = createRoot(container);

  const close = () => {
    setTimeout(() => {
      toastRoot.unmount();
      container.remove();
    }, 300);
  };

  toastRoot.render(<Toast message={message} type={type} onClose={close} />);

  setTimeout(() => {
    close();
  }, 3000);
}
