"use client";

import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

type ConfirmType = "default" | "danger" | "warning" | "success";

let confirmRoot: any = null;

function ConfirmModal({
  message,
  type,
  onConfirm,
  onCancel,
}: {
  message: string;
  type: ConfirmType;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const getStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertCircle size={22} className="text-red-500" />,
          button: "bg-red-500 hover:bg-red-600",
        };
      case "warning":
        return {
          icon: <AlertTriangle size={22} className="text-yellow-500" />,
          button: "bg-yellow-500 hover:bg-yellow-600 text-black",
        };
      case "success":
        return {
          icon: <CheckCircle size={22} className="text-green-500" />,
          button: "bg-green-500 hover:bg-green-600",
        };
      default:
        return {
          icon: <AlertTriangle size={22} className="text-orange-500" />,
          button:
            "bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90",
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            {styles.icon}
            <h3 className="text-lg font-semibold capitalize">
              {type} Confirmation
            </h3>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className={`px-5 py-2 rounded-xl text-white font-medium transition ${styles.button}`}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function showConfirm(
  message: string,
  type: ConfirmType = "default",
): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    confirmRoot = createRoot(container);

    const close = (result: boolean) => {
      confirmRoot.unmount();
      container.remove();
      resolve(result);
    };

    confirmRoot.render(
      <ConfirmModal
        message={message}
        type={type}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />,
    );
  });
}
