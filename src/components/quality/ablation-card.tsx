"use client";

import React from "react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SourceAttributionBadge } from "./source-attribution-badge";
import { Zap, ArrowDownRight, Clock, Target, Layers, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AblationData {
  token_reduction_pct: number;
  uncompressed_tokens: number;
  compressed_tokens: number;
  latency_speedup_ms: number;
  tcr_parity: number;
}

interface AblationCardProps {
  ablation?: AblationData;
  sourceType?: "FakeLLM / synthetic" | "Live LLM";
  datasetName?: string;
  caseCount?: number;
  runTimestamp?: string;
}

export function AblationCard({
  ablation = {
    token_reduction_pct: 45.92,
    uncompressed_tokens: 200465,
    compressed_tokens: 108411,
    latency_speedup_ms: 25.07,
    tcr_parity: 0.0,
  },
  sourceType = "FakeLLM / synthetic",
  datasetName = "disputes_400.jsonl",
  caseCount = 420,
  runTimestamp = "Nov 14, 2026 10:30 UTC",
}: AblationCardProps) {
  const tokenSavingsFormatted = `-${ablation.token_reduction_pct.toFixed(1)}%`;
  const speedupFormatted = `${ablation.latency_speedup_ms.toFixed(1)}ms`;
  const accuracyLossFormatted = `${ablation.tcr_parity.toFixed(2)}%`;

  return (
    <GlassPanel className="p-6 border-zinc-700/50 bg-[#18181B]/95 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Context Compression Ablation Analysis
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {tokenSavingsFormatted} Tokens
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Evaluation of adaptive token compression while preserving 100% of canonical AP identifiers.
              </p>
            </div>
          </div>

          {/* Mandatory Source Attribution */}
          <SourceAttributionBadge
            sourceType={sourceType}
            datasetName={datasetName}
            caseCount={caseCount}
            runTimestamp={runTimestamp}
            size="xs"
          />
        </div>

        {/* 3 Core Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          {/* Card 1: Token Savings */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-sans">
              <span>Token Volume Saved</span>
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-mono font-bold text-emerald-400">
              {tokenSavingsFormatted}
            </div>
            <div className="mt-1 text-[11px] font-mono text-zinc-400">
              {ablation.compressed_tokens.toLocaleString()} vs {ablation.uncompressed_tokens.toLocaleString()}
            </div>
          </div>

          {/* Card 2: Latency Speedup */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-sans">
              <span>Latency Speedup</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-mono font-bold text-cyan-400">
              -{speedupFormatted}
            </div>
            <div className="mt-1 text-[11px] font-mono text-zinc-400">
              24.0ms vs 49.1ms avg per dispute
            </div>
          </div>

          {/* Card 3: Accuracy Loss */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-sans">
              <span>Accuracy / TCR Loss</span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-mono font-bold text-blue-400">
              {accuracyLossFormatted}
            </div>
            <div className="mt-1 text-[11px] font-mono text-emerald-400">
              100.00% Zero-Parity Loss
            </div>
          </div>
        </div>

        {/* Side-by-Side Detailed Breakdown Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase font-mono tracking-wider text-[11px] border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Pipeline Metric</th>
                <th className="px-4 py-3">Uncompressed Pipeline</th>
                <th className="px-4 py-3">Compressed Pipeline</th>
                <th className="px-4 py-3 text-right">Delta / Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              <tr className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 font-sans font-medium text-zinc-200">Prompt Tokens</td>
                <td className="px-4 py-3 text-zinc-400">177,365 tokens</td>
                <td className="px-4 py-3 text-white font-semibold">89,511 tokens</td>
                <td className="px-4 py-3 text-right text-emerald-400 font-bold">-49.5%</td>
              </tr>
              <tr className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 font-sans font-medium text-zinc-200">Completion Tokens</td>
                <td className="px-4 py-3 text-zinc-400">23,100 tokens</td>
                <td className="px-4 py-3 text-white font-semibold">18,900 tokens</td>
                <td className="px-4 py-3 text-right text-zinc-400">-18.2%</td>
              </tr>
              <tr className="bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-3 font-sans font-semibold text-white">Total Tokens</td>
                <td className="px-4 py-3 text-zinc-400 font-medium">{ablation.uncompressed_tokens.toLocaleString()} tokens</td>
                <td className="px-4 py-3 text-cyan-300 font-bold">{ablation.compressed_tokens.toLocaleString()} tokens</td>
                <td className="px-4 py-3 text-right text-emerald-400 font-extrabold">{tokenSavingsFormatted}</td>
              </tr>
              <tr className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 font-sans font-medium text-zinc-200">Average Turn Latency</td>
                <td className="px-4 py-3 text-zinc-400">49.1 ms</td>
                <td className="px-4 py-3 text-white font-semibold">24.0 ms</td>
                <td className="px-4 py-3 text-right text-cyan-400 font-bold">-25.1 ms speedup</td>
              </tr>
              <tr className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-4 py-3 font-sans font-medium text-zinc-200">Task Completion Rate (TCR)</td>
                <td className="px-4 py-3 text-zinc-400">100.00%</td>
                <td className="px-4 py-3 text-white font-semibold">100.00%</td>
                <td className="px-4 py-3 text-right text-emerald-400 font-bold">+0.00% (No accuracy loss)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual Token Comparison Bar */}
        <div className="mt-5 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-zinc-400 font-sans">Token Footprint Comparison</span>
            <span className="text-zinc-300">
              Compression Ratio: <span className="text-cyan-400 font-bold">1.85x</span>
            </span>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span>Uncompressed Baseline</span>
                <span>200,465 tokens (100%)</span>
              </div>
              <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-500 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span>Compressed Pipeline</span>
                <span className="text-emerald-400 font-semibold">108,411 tokens (54.1%)</span>
              </div>
              <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-[54.1%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Source Attribution Footer */}
      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-sans">
          Ablation test performed across all 420 benchmark disputes
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
