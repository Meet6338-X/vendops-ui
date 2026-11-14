"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Scrim / Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#18181B] p-6 shadow-2xl transition-all duration-300 animate-fade-in text-zinc-100",
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4">{children}</div>
      </div>
    </div>
  );
}
