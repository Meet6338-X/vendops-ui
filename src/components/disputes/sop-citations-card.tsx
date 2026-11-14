"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Percent,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { RetrievedPolicy } from "@/lib/schemas/dispute";

interface SopCitationsCardProps {
  policies?: RetrievedPolicy[];
}

export function SopCitationsCard({ policies = [] }: SopCitationsCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(0);

  if (!policies || policies.length === 0) {
    return (
      <GlassPanel className="p-4 opacity-75">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-400">Retrieved SOP Citations</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">No RAG policies retrieved yet</span>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-4 transition-all">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            Retrieved SOP Policy Citations
          </h3>
          <span className="text-[11px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-600/40">
            {policies.length} {policies.length === 1 ? "Citation" : "Citations"}
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
        <div className="mt-4 space-y-3 pt-3 border-t border-zinc-800/80">
          {policies.map((policy, idx) => {
            const isCardExpanded = expandedId === idx;
            const scorePct = policy.score != null ? Math.round(policy.score * 100) : null;

            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedId(isCardExpanded ? null : idx)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-100">{policy.title}</div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        Section: {policy.section}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {scorePct != null && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-600/40">
                        {scorePct}% match
                      </span>
                    )}
                    <button type="button" className="text-zinc-500 hover:text-zinc-300">
                      {isCardExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {isCardExpanded && (
                  <div className="p-3 pt-0 border-t border-zinc-800/40 bg-zinc-900/40 text-xs text-zinc-300 leading-relaxed font-sans">
                    <p className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-300 italic">
                      &ldquo;{policy.text}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </GlassPanel>
  );
}
