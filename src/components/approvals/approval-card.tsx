"use client";

import React, { useState } from "react";
import { ApprovalQueueItem } from "@/lib/schemas/dispute";
import { formatCurrency, formatKolkataTime, formatRelativeTime, cn } from "@/lib/utils";
import { ActionBadge } from "./action-badge";
import { MatchSnapshot } from "./match-snapshot";
import { ReviewModal, ReviewIntent } from "./review-modal";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sliders,
  Clock,
  Sparkles,
  FileCheck,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

interface ApprovalCardProps {
  item: ApprovalQueueItem;
}

export function ApprovalCard({ item }: ApprovalCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIntent, setModalIntent] = useState<ReviewIntent>("APPROVE");

  const amountAtRisk =
    item.interrupt.amount ??
    item.proposal?.amount ??
    item.match_result?.billed_amount ??
    0;

  const proposedAction =
    item.proposal?.action || item.interrupt.action || "RELEASE_PAYMENT";

  const reason = item.interrupt.reason || "Autonomous intervention triggered by policy limit";
  const rationale = item.proposal?.rationale || "Automated invoice audit completed. Waiting on director authorization.";

  // Combine unique evidence citations
  const evidenceList = Array.from(
    new Set([
      ...(item.interrupt.evidence || []),
      ...(item.proposal?.evidence || []),
    ])
  );

  const handleActionClick = (intent: ReviewIntent) => {
    setModalIntent(intent);
    setModalOpen(true);
  };

  return (
    <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/50 hover:border-zinc-600/80 transition-all duration-200 overflow-hidden shadow-xl shadow-black/20 flex flex-col">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-900/40 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700/60 font-mono font-semibold text-zinc-300">
            <span className="text-zinc-500">ID:</span>
            <span>{item.thread_id}</span>
          </div>
          {item.created_at && (
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formatKolkataTime(item.created_at)}</span>
              <span className="text-zinc-600">({formatRelativeTime(item.created_at)})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>HITL Interrupt</span>
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5 flex-1">
        {/* Main Grid: Amount & Interrupt Reason */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Amount at Risk & Action */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/90">
              <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                Amount at Risk
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white">
                {formatCurrency(amountAtRisk)}
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Proposed Action:</span>
                <ActionBadge action={proposedAction} size="sm" />
              </div>
              {item.proposal?.confidence !== undefined && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Autonomous Confidence:</span>
                  <span className="text-emerald-400 font-semibold">
                    {(item.proposal.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Interrupt Reason Callout */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Intervention Trigger Reason</span>
              </div>
              <p className="text-sm font-sans font-medium text-amber-100 leading-relaxed">
                {reason}
              </p>
            </div>

            {/* AI Rationale */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Agent Rationale</span>
              </div>
              <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                {rationale}
              </p>
            </div>
          </div>
        </div>

        {/* Vendor Raw Message (Devanagari/Hinglish safe with leading-relaxed) */}
        {item.raw_message && (
          <div className="rounded-xl bg-zinc-900/30 border border-zinc-800/60 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 uppercase">
              <MessageSquare className="w-3 h-3 text-zinc-400" />
              <span>Vendor Query Stream</span>
            </div>
            <p className="text-xs font-sans text-zinc-300 leading-relaxed italic border-l-2 border-blue-500/50 pl-3 py-0.5">
              &ldquo;{item.raw_message}&rdquo;
            </p>
          </div>
        )}

        {/* 3-Way Match Snapshot */}
        <MatchSnapshot matchResult={item.match_result} />

        {/* Evidence Citations */}
        {evidenceList.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Audit Evidence &amp; Policy Citations</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {evidenceList.map((evidence, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-zinc-900/80 border border-zinc-700/60 text-xs font-mono text-zinc-300 flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{evidence}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-zinc-500 font-mono">
          Pending manual signoff before ERP payment journal dispatch.
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Modify Terms */}
          <button
            type="button"
            onClick={() => handleActionClick("MODIFY")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-700 bg-zinc-800/90 text-zinc-200 hover:text-white hover:bg-zinc-700/80 hover:border-zinc-600 transition-all shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Modify Terms</span>
          </button>

          {/* Reject Claim */}
          <button
            type="button"
            onClick={() => handleActionClick("REJECT")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-500/30 bg-red-950/20 text-red-300 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-200 transition-all shadow-sm"
          >
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Reject Claim</span>
          </button>

          {/* Approve Resolution */}
          <button
            type="button"
            onClick={() => handleActionClick("APPROVE")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
            <span>Approve Resolution</span>
          </button>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        approvalItem={item}
        initialIntent={modalIntent}
      />
    </div>
  );
}
