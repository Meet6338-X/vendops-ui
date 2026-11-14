import React from "react";
import { GlassPanel } from "./glass-panel";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral" | "warning";
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: "blue" | "emerald" | "orange" | "red";
  sourceTag?: string; // "FakeLLM / synthetic" vs "Live LLM"
  className?: string;
}

export function MetricCard({
  label,
  value,
  subValue,
  trend,
  trendType = "positive",
  icon: Icon,
  accentColor = "blue",
  sourceTag,
  className,
}: MetricCardProps) {
  const accentStyles = {
    blue: {
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      glow: "hover:border-blue-500/30",
    },
    emerald: {
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      glow: "hover:border-emerald-500/30",
    },
    orange: {
      iconBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      glow: "hover:border-orange-500/30",
    },
    red: {
      iconBg: "bg-red-500/10 text-red-400 border-red-500/20",
      glow: "hover:border-red-500/30",
    },
  };

  const trendStyles = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    negative: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    neutral: "bg-zinc-800 text-zinc-400 border-zinc-700/50",
  };

  return (
    <GlassPanel className={cn("p-5 flex flex-col justify-between", accentStyles[accentColor].glow, className)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl border", accentStyles[accentColor].iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">{label}</h4>
            {sourceTag && (
              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                {sourceTag}
              </span>
            )}
          </div>
        </div>

        {trend && (
          <span className={cn("px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border", trendStyles[trendType])}>
            {trend}
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white">{value}</div>
        {subValue && <p className="mt-1 text-xs text-zinc-500 font-sans">{subValue}</p>}
      </div>
    </GlassPanel>
  );
}
