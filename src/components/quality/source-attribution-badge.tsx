"use client";

import React from "react";
import { Database, Cpu, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SourceAttributionProps {
  sourceType?: "FakeLLM / synthetic" | "Live LLM";
  datasetName?: string;
  caseCount?: number;
  runTimestamp?: string;
  className?: string;
  size?: "xs" | "sm" | "md";
  showTimestamp?: boolean;
}

export function SourceAttributionBadge({
  sourceType = "FakeLLM / synthetic",
  datasetName = "disputes_400.jsonl",
  caseCount = 420,
  runTimestamp = "Nov 14, 2026 10:30 UTC",
  className,
  size = "sm",
  showTimestamp = true,
}: SourceAttributionProps) {
  const isLive = sourceType === "Live LLM";

  if (size === "xs") {
    return (
      <div
        className={cn(
          "inline-flex flex-wrap items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border leading-tight",
          isLive
            ? "bg-purple-950/30 text-purple-300 border-purple-700/40"
            : "bg-blue-950/30 text-blue-300 border-blue-700/40",
          className
        )}
      >
        <span className="flex items-center gap-1 font-semibold">
          <Cpu className="w-3 h-3 text-blue-400" />
          {sourceType}
        </span>
        <span className="text-zinc-500">•</span>
        <span className="text-zinc-400">{datasetName}</span>
        <span className="text-zinc-500">•</span>
        <span className="text-zinc-300 font-bold">{caseCount} cases</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border backdrop-blur-sm",
        isLive
          ? "bg-purple-950/40 text-purple-200 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.1)]"
          : "bg-zinc-900/90 text-zinc-300 border-zinc-700/60 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            isLive ? "bg-purple-400 animate-pulse" : "bg-cyan-400"
          )}
        />
        <span className="font-semibold text-zinc-200 flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          {sourceType}
        </span>
      </div>

      <span className="text-zinc-600 dark:text-zinc-600">|</span>

      <span className="flex items-center gap-1 text-zinc-400">
        <Database className="w-3 h-3 text-zinc-500" />
        <span className="text-zinc-300 font-medium">{datasetName}</span>
        <span className="text-zinc-400">({caseCount} cases)</span>
      </span>

      {showTimestamp && (
        <>
          <span className="text-zinc-600 dark:text-zinc-600">|</span>
          <span className="flex items-center gap-1 text-zinc-500">
            <Calendar className="w-3 h-3" />
            <span>{runTimestamp}</span>
          </span>
        </>
      )}
    </div>
  );
}
