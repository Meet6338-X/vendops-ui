"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "critical" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  subtitle?: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, subtitle?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, subtitle?: string, type: ToastType = "info") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, title, subtitle, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const borderStyles = {
    success: "border-l-emerald-500 text-emerald-400",
    critical: "border-l-red-500 text-red-400",
    warning: "border-l-orange-500 text-orange-400",
    info: "border-l-blue-500 text-blue-400",
  };

  const Icons = {
    success: CheckCircle2,
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Fixed top-right notification stack */}
      <div className="fixed top-6 right-6 z-50 w-80 space-y-3 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = Icons[toast.type];
          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto p-4 rounded-2xl bg-[#18181B]/95 backdrop-blur-md border border-zinc-800 shadow-2xl transition-all duration-300 animate-slide-in-right",
                "border-l-4",
                borderStyles[toast.type]
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-white tracking-wide">{toast.title}</h5>
                    {toast.subtitle && (
                      <p className="mt-1 text-[10px] font-mono text-zinc-400 line-clamp-2 leading-relaxed">
                        {toast.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
