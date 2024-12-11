"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastPosition, ToastType } from "@/types/toast";
import { ToastContainer } from "@/components/ui/Toast";

interface ToastContextData {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({
  children,
  position = "top-right",
}: {
  children: React.ReactNode;
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substring(2);
    const toast = { id, message, type, duration };

    setToasts((state) => [...state, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((state) => state.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer position={position} toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
