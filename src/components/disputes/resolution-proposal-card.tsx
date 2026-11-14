"use client";

import React, { useState } from "react";
import {
  Gavel,
  ChevronDown,
  ChevronUp,
  DollarSign,
  CheckCircle,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { ResolutionProposal } from "@/lib/schemas/dispute";
import { cn } from "@/lib/utils";

interface ResolutionProposalCardProps {
  proposal?: ResolutionProposal | null;
}

export function ResolutionProposalCard({ proposal }: ResolutionProposalCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!proposal) {
    return (
      <GlassPanel className="p-4 opacity-75">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-400">Synthesized Resolution Proposal</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Awaiting policy synthesis...</span>
        </div>
      </GlassPanel>
    );
  }

  const confidencePct = Math.round((proposal.confidence ?? 0) * 100);

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "RELEASE_PAYMENT":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-600/50";
      case "PARTIAL_PAYMENT":
        return "bg-blue-950/80 text-blue-300 border-blue-600/50";
      case "CREDIT_NOTE":
        return "bg-purple-950/80 text-purple-300 border-purple-600/50";
      case "REPLACEMENT":
        return "bg-cyan-950/80 text-cyan-300 border-cyan-600/50";
      case "REJECT":
        return "bg-red-950/80 text-red-300 border-red-600/50";
      case "ESCALATE":
        return "bg-orange-950/80 text-orange-300 border-orange-600/50";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <GlassPanel className="p-4 transition-all">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Gavel className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            Synthesized Resolution Proposal
          </h3>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider",
              getActionBadgeStyle(proposal.action)
            )}
          >
            {proposal.action}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40">
            {confidencePct}% Confidence
          </span>
          <button
            type="button"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 pt-3 border-t border-zinc-800/80">
          {/* Action & Amount Spotlight */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-zinc-900/40 to-zinc-950/40 border border-blue-600/30">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-400">Proposed Action</div>
              <div className="text-base font-bold text-zinc-100 tracking-tight">
                {proposal.action.replace("_", " ")}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-[10px] font-mono uppercase text-zinc-400">Disbursement / Credit Amount</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                ${proposal.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </div>
            </div>
          </div>

          {/* Rationale */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-zinc-400">Autonomous Policy Rationale:</span>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-200 leading-relaxed font-sans">
              {proposal.rationale}
            </div>
          </div>

          {/* Evidence Bullets */}
          {proposal.evidence && proposal.evidence.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-zinc-400" />
                Grounding Evidence Artifacts:
              </span>
              <ul className="space-y-1.5">
                {proposal.evidence.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-xs text-zinc-300"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </GlassPanel>
  );
}
