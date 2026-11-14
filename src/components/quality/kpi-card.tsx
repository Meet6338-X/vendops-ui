"use client";

import React from "react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SourceAttributionBadge } from "./source-attribution-badge";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QualityKpiCardProps {
  label: string;
  value: string | number;
  gateText?: string;
  gatePassed?: boolean;
  statusText?: string;
  subValue?: string;
  contextNote?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: "blue" | "emerald" | "orange" | "red" | "purple";
  sourceType?: "FakeLLM / synthetic" | "Live LLM";
  datasetName?: string;
  caseCount?: number;
  runTimestamp?: string;
  highlightBadge?: string;
  className?: string;
}

export function QualityKpiCard({
  label,
  value,
  gateText,
  gatePassed = true,
  statusText = "PASS",
  subValue,
  contextNote,
  icon: Icon,
  accentColor = "blue",
  sourceType = "FakeLLM / synthetic",
  datasetName = "disputes_400.jsonl",
  caseCount = 420,
  runTimestamp = "Nov 14, 2026 10:30 UTC",
  highlightBadge,
  className,
}: QualityKpiCardProps) {
  const accentStyles = {
    blue: {
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      borderGlow: "hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    },
    emerald: {
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      borderGlow: "hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    },
    orange: {
      iconBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      borderGlow: "hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]",
    },
    red: {
      iconBg: "bg-red-500/10 text-red-400 border-red-500/20",
      borderGlow: "hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    },
    purple: {
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      borderGlow: "hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    },
  };

  return (
    <GlassPanel
      className={cn(
        "p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 border-zinc-700/50 bg-[#18181B]/95",
        accentStyles[accentColor].borderGlow,
        className
      )}
    >
      {/* Top row: Icon, Label, and Gate/Status badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl border flex-shrink-0", accentStyles[accentColor].iconBg)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-zinc-300 uppercase font-sans">
                {label}
              </h4>
              {contextNote && (
                <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                  {contextNote}
                </span>
              )}
            </div>
          </div>

          {/* Gate status badge */}
          {gateText && (
            <div className="flex flex-col items-end gap-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold border",
                  gatePassed
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-red-500/15 text-red-300 border-red-500/30"
                )}
              >
                {gatePassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                )}
                {statusText}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {gateText}
              </span>
            </div>
          )}

          {highlightBadge && !gateText && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
              {highlightBadge}
            </span>
          )}
        </div>

        {/* Primary Value */}
        <div className="mt-2">
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white flex items-baseline gap-2">
            <span>{value}</span>
            {subValue && (
              <span className="text-xs font-sans font-normal text-zinc-400">
                {subValue}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Source Attribution Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <SourceAttributionBadge
          sourceType={sourceType}
          datasetName={datasetName}
          caseCount={caseCount}
          runTimestamp={runTimestamp}
          size="xs"
        />
      </div>
    </GlassPanel>
  );
}
