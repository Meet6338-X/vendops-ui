"use client";

import React, { useState } from "react";
import {
  Minimize2,
  ChevronDown,
  ChevronUp,
  Cpu,
  TrendingDown,
  Layers,
  ArrowRight,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";

interface CompressionStatsCardProps {
  rawMessage?: string;
  normalizedMessage?: string;
  tokenFertility?: number;
}

export function CompressionStatsCard({
  rawMessage = "",
  normalizedMessage = "",
  tokenFertility = 1.35,
}: CompressionStatsCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const rawWordCount = rawMessage.trim() ? rawMessage.trim().split(/\s+/).length : 0;
  const normWordCount = normalizedMessage.trim()
    ? normalizedMessage.trim().split(/\s+/).length
    : rawWordCount;

  // Approximate token calculations
  const rawEstTokens = Math.round(rawWordCount * (tokenFertility || 1.35));
  const normEstTokens = Math.max(1, Math.round(normWordCount * 1.05));
  const savingsPct =
    rawEstTokens > 0 ? Math.max(0, Math.round(((rawEstTokens - normEstTokens) / rawEstTokens) * 100)) : 0;

  return (
    <GlassPanel className="p-4 transition-all">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Minimize2 className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            Token Fertility & Context Compression
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40">
            {savingsPct > 0 ? `-${savingsPct}% context tokens` : "Compressed"}
          </span>
        </div>

        <button
          type="button"
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 pt-3 border-t border-zinc-800/80">
          {/* Key Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Token Fertility
              </span>
              <div className="text-base font-mono font-bold text-zinc-100">
                {tokenFertility ? tokenFertility.toFixed(2) : "1.35"}{" "}
                <span className="text-xs font-normal text-zinc-500">tokens/word</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Token Reduction
              </span>
              <div className="text-base font-mono font-bold text-zinc-100">
                {rawEstTokens} <ArrowRight className="w-3 h-3 inline text-zinc-500 mx-1" />{" "}
                <span className="text-emerald-400">{normEstTokens}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5 mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                Cost & Latency Gain
              </span>
              <div className="text-base font-mono font-bold text-emerald-400">
                {savingsPct}% <span className="text-xs font-normal text-zinc-400">RAG savings</span>
              </div>
            </div>
          </div>

          {/* Normalized Message Preview */}
          {normalizedMessage && normalizedMessage !== rawMessage && (
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs space-y-1">
              <div className="text-[11px] font-mono uppercase text-zinc-400">
                Normalized Dense Context (Stripped Fillers):
              </div>
              <p className="font-sans text-zinc-300 leading-relaxed italic">
                &ldquo;{normalizedMessage}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </GlassPanel>
  );
}
