import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "glow" | "alert";
  glowColor?: "blue" | "emerald" | "orange" | "red";
}

export function GlassPanel({
  children,
  className,
  variant = "default",
  glowColor = "blue",
  ...props
}: GlassPanelProps) {
  const glowStyles = {
    blue: "shadow-[0_0_24px_-4px_rgba(59,130,246,0.15)]",
    emerald: "shadow-[0_0_24px_-4px_rgba(16,185,129,0.15)]",
    orange: "shadow-[0_0_24px_-4px_rgba(249,115,22,0.15)]",
    red: "shadow-[0_0_24px_-4px_rgba(239,68,68,0.2)]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variant === "default" && "glass-panel bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 text-zinc-100",
        variant === "subtle" && "bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 text-zinc-300",
        variant === "glow" && `glass-panel bg-[#18181B]/95 border border-blue-500/30 ${glowStyles[glowColor]}`,
        variant === "alert" && "glass-panel bg-red-950/20 border border-red-500/40 text-red-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
