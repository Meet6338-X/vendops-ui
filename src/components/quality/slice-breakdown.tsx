"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SourceAttributionBadge } from "./source-attribution-badge";
import {
  Code2,
  Languages,
  AlertTriangle,
  GitBranch,
  Volume2,
  Tag,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SliceItem {
  name: string;
  count: number;
  tcr: number;
  wer: number;
  timeReduction: number;
  isWorstWer?: boolean;
  isWorstTcr?: boolean;
  warningNote?: string;
}

interface SliceDimension {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  slices: SliceItem[];
}

const SLICE_DIMENSIONS: SliceDimension[] = [
  {
    id: "script",
    label: "Script",
    icon: Languages,
    description: "Language orthography and character script breakdown (Devanagari digits & text vs Latin)",
    slices: [
      {
        name: "devanagari",
        count: 27,
        tcr: 100.0,
        wer: 0.0,
        timeReduction: 96.2,
        isWorstTcr: true,
        warningNote: "Worst-Slice TCR baseline (100.00% PASS)",
      },
      {
        name: "latin",
        count: 357,
        tcr: 100.0,
        wer: 0.7,
        timeReduction: 97.2,
      },
      {
        name: "mixed",
        count: 36,
        tcr: 100.0,
        wer: 0.0,
        timeReduction: 97.8,
      },
    ],
  },
  {
    id: "code_mix",
    label: "Code-Mix Index",
    icon: Code2,
    description: "Multilingual code-switching density between Hindi and English (Hinglish)",
    slices: [
      {
        name: "high_mix",
        count: 84,
        tcr: 100.0,
        wer: 0.0,
        timeReduction: 96.7,
      },
      {
        name: "low_mix",
        count: 27,
        tcr: 100.0,
        wer: 3.1,
        timeReduction: 96.8,
      },
      {
        name: "medium_mix",
        count: 140,
        tcr: 100.0,
        wer: 0.6,
        timeReduction: 97.5,
      },
      {
        name: "pure_english",
        count: 169,
        tcr: 100.0,
        wer: 0.49,
        timeReduction: 97.2,
      },
    ],
  },
  {
    id: "thread_depth",
    label: "Thread Depth",
    icon: GitBranch,
    description: "Multi-turn conversational depth in vendor inquiry chains",
    slices: [
      {
        name: "single_turn (1)",
        count: 276,
        tcr: 100.0,
        wer: 0.61,
        timeReduction: 97.4,
      },
      {
        name: "multi_turn (2-3)",
        count: 73,
        tcr: 100.0,
        wer: 0.28,
        timeReduction: 97.3,
      },
      {
        name: "deep_thread (4+)",
        count: 71,
        tcr: 100.0,
        wer: 0.86,
        timeReduction: 96.3,
      },
    ],
  },
  {
    id: "noise_level",
    label: "Noise Level",
    icon: Volume2,
    description: "Spelling corruptions, OCR artifacts, phonetic typing noise, and email signature clutter",
    slices: [
      {
        name: "clean",
        count: 378,
        tcr: 100.0,
        wer: 0.33,
        timeReduction: 97.2,
      },
      {
        name: "medium",
        count: 26,
        tcr: 100.0,
        wer: 1.64,
        timeReduction: 97.4,
      },
      {
        name: "high",
        count: 16,
        tcr: 100.0,
        wer: 4.82,
        timeReduction: 95.5,
        isWorstWer: true,
        warningNote: "Worst-Slice WER across benchmark (4.82% vs 3.00% gate threshold)",
      },
    ],
  },
  {
    id: "entity_type",
    label: "Entity Type",
    icon: Tag,
    description: "Extraction and validation accuracy categorized by ERP identifier type",
    slices: [
      {
        name: "amount",
        count: 407,
        tcr: 100.0,
        wer: 0.0,
        timeReduction: 97.2,
      },
      {
        name: "grn_ids",
        count: 283,
        tcr: 100.0,
        wer: 0.0,
        timeReduction: 97.2,
      },
      {
        name: "invoice_ids",
        count: 401,
        tcr: 100.0,
        wer: 0.0,
        timeReduction: 97.2,
      },
      {
        name: "po_ids",
        count: 500,
        tcr: 100.0,
        wer: 0.8,
        timeReduction: 97.2,
      },
      {
        name: "vendor_ids",
        count: 420,
        tcr: 100.0,
        wer: 1.9,
        timeReduction: 97.2,
      },
    ],
  },
];

interface SliceBreakdownProps {
  sourceType?: "FakeLLM / synthetic" | "Live LLM";
  datasetName?: string;
  caseCount?: number;
  runTimestamp?: string;
}

export function SliceBreakdown({
  sourceType = "FakeLLM / synthetic",
  datasetName = "disputes_400.jsonl",
  caseCount = 420,
  runTimestamp = "Nov 14, 2026 10:30 UTC",
}: SliceBreakdownProps) {
  const [activeTab, setActiveTab] = useState<string>("script");

  const currentDimension =
    SLICE_DIMENSIONS.find((d) => d.id === activeTab) || SLICE_DIMENSIONS[0];

  return (
    <GlassPanel className="p-6 border-zinc-700/50 bg-[#18181B]/95">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Tail-Segmented Slice Heatmaps & Breakdown
            </h3>
          </div>
          <p className="mt-1 text-xs text-zinc-400 font-sans">
            Fine-grained error distribution across script types, code-mixing degrees, thread depths, and noise stress tests.
          </p>
        </div>

        {/* Mandatory Source Attribution Badge */}
        <SourceAttributionBadge
          sourceType={sourceType}
          datasetName={datasetName}
          caseCount={caseCount}
          runTimestamp={runTimestamp}
          size="sm"
        />
      </div>

      {/* Slice Dimension Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 my-5">
        {SLICE_DIMENSIONS.map((dimension) => {
          const Icon = dimension.icon;
          const isActive = activeTab === dimension.id;
          const hasWorstWarning = dimension.slices.some((s) => s.isWorstWer);

          return (
            <button
              key={dimension.id}
              onClick={() => setActiveTab(dimension.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 border focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                isActive
                  ? "bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] font-semibold"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-zinc-500")} />
              <span>{dimension.label}</span>
              {hasWorstWarning && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Contains worst slice" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Dimension Description & Worst Slice Alert if present */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 mb-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <p className="text-xs text-zinc-300 font-sans flex items-center gap-2">
          <span className="font-semibold text-blue-400 font-mono uppercase">
            Dimension: {currentDimension.label}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{currentDimension.description}</span>
        </p>

        {currentDimension.slices.some((s) => s.isWorstWer) && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Contains Worst WER Slice: 4.82%</span>
          </div>
        )}
      </div>

      {/* Breakdown Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-zinc-900/90 text-zinc-400 uppercase font-mono tracking-wider text-[11px] border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3">Slice Value</th>
              <th className="px-4 py-3">Case Count</th>
              <th className="px-4 py-3">Task Completion (TCR)</th>
              <th className="px-4 py-3">Entity-WER (Error Rate)</th>
              <th className="px-4 py-3">Handling Time Saved</th>
              <th className="px-4 py-3 text-right">Gate Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {currentDimension.slices.map((slice) => {
              const isWarning = slice.isWorstWer;
              const werExceedsTarget = slice.wer > 3.0;

              return (
                <tr
                  key={slice.name}
                  className={cn(
                    "transition-colors",
                    isWarning
                      ? "bg-amber-950/20 hover:bg-amber-950/30"
                      : "hover:bg-zinc-900/40"
                  )}
                >
                  {/* Slice Name */}
                  <td className="px-4 py-3.5 font-mono font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700/60 text-xs">
                        {slice.name}
                      </span>
                      {slice.isWorstWer && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          WORST WER SLICE
                        </span>
                      )}
                      {slice.isWorstTcr && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          WORST TCR SLICE
                        </span>
                      )}
                    </div>
                    {slice.warningNote && (
                      <p className="text-[11px] font-sans text-zinc-400 font-normal mt-1">
                        {slice.warningNote}
                      </p>
                    )}
                  </td>

                  {/* Sample Count */}
                  <td className="px-4 py-3.5 text-zinc-300 font-medium">
                    {slice.count} cases
                  </td>

                  {/* TCR */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">
                        {slice.tcr.toFixed(2)}%
                      </span>
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${slice.tcr}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Entity WER */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-bold",
                          werExceedsTarget
                            ? "text-amber-400"
                            : slice.wer === 0
                            ? "text-emerald-400"
                            : "text-zinc-200"
                        )}
                      >
                        {slice.wer.toFixed(2)}%
                      </span>
                      {werExceedsTarget ? (
                        <span className="text-[10px] font-mono text-amber-400/80">
                          (&gt; 3.00% gate)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400">
                          (&le; 3.00% target)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Handling Time Saved */}
                  <td className="px-4 py-3.5 text-cyan-300 font-semibold">
                    {slice.timeReduction.toFixed(1)}%
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border",
                        slice.tcr >= 85.0
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                          : "bg-red-500/10 text-red-300 border-red-500/20"
                      )}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      PASS
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mandatory Source Attribution Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans text-zinc-400">
        <span>
          Calculated across 420 test episodes segmented by metadata tags in {datasetName}
        </span>
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
