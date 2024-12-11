"use client";

import { useEffect, useState } from "react";
import { Toast as ToastType, ToastPosition } from "@/types/toast";
import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const Toast = ({ toast, onRemove }: ToastProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev > 0) {
            return prev - 100 / (toast.duration! / 10);
          }
          return 0;
        });
      }, 10);

      return () => clearInterval(timer);
    }
  }, [toast.duration]);

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        relative flex items-center w-96 p-4 rounded-lg shadow-lg bg-white
        border-l-4 ${colors[toast.type].replace("bg-", "border-")}
      `}
    >
      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${colors[toast.type]} text-white mr-3`}>
        {icons[toast.type]}
      </div>
      <p className="text-gray-800 font-medium">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        ✕
      </button>
      {toast.duration && (
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${colors[toast.type]} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  position: ToastPosition;
  removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, position, removeToast }: ToastContainerProps) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <div className={`fixed z-50 m-4 ${positionClasses[position]}`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div key={toast.id} layout className="mb-4">
            <Toast toast={toast} onRemove={removeToast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
