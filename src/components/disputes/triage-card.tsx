"use client";

import React, { useState } from "react";
import {
  ListFilter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  DollarSign,
  Building,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { TriageResult } from "@/lib/schemas/dispute";
import { cn } from "@/lib/utils";

interface TriageCardProps {
  triage?: TriageResult | null;
}

export function TriageCard({ triage }: TriageCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!triage) {
    return (
      <GlassPanel className="p-4 opacity-75">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-400">Triage & Categorization</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Awaiting node execution...</span>
        </div>
      </GlassPanel>
    );
  }

  const confidencePct = Math.round((triage.confidence ?? 0) * 100);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-950/80 text-red-300 border-red-600/60";
      case "HIGH":
        return "bg-orange-950/80 text-orange-300 border-orange-600/60";
      case "MEDIUM":
        return "bg-amber-950/80 text-amber-300 border-amber-600/60";
      case "LOW":
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const getDisputeTypeStyle = (type: string) => {
    switch (type) {
      case "PAYMENT_DELAY":
        return "bg-blue-950/60 text-blue-300 border-blue-600/50";
      case "SHORT_PAYMENT":
        return "bg-cyan-950/60 text-cyan-300 border-cyan-600/50";
      case "PRICE_MISMATCH":
        return "bg-purple-950/60 text-purple-300 border-purple-600/50";
      case "QTY_MISMATCH":
        return "bg-indigo-950/60 text-indigo-300 border-indigo-600/50";
      case "DUPLICATE_INVOICE":
        return "bg-rose-950/60 text-rose-300 border-rose-600/50";
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
          <ListFilter className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            Triage & Categorization
          </h3>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase",
              getPriorityStyle(triage.priority)
            )}
          >
            {triage.priority} PRIORITY
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-2.5 py-0.5 rounded text-xs font-mono font-semibold border",
              getDisputeTypeStyle(triage.dispute_type)
            )}
          >
            {triage.dispute_type}
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
          {/* Summary / Rationale */}
          {triage.summary && (
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
              <span className="font-semibold text-zinc-200">Triage Summary: </span>
              {triage.summary}
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Confidence Meter */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-[11px] uppercase">Confidence</span>
                <span className="font-mono font-bold text-zinc-200">{confidencePct}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    confidencePct >= 90
                      ? "bg-emerald-500"
                      : confidencePct >= 70
                      ? "bg-blue-500"
                      : "bg-orange-500"
                  )}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
            </div>

            {/* Disputed Amount */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                Disputed Amount
              </span>
              <div className="text-base font-mono font-bold text-zinc-100">
                {triage.disputed_amount != null
                  ? `$${triage.disputed_amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "N/A"}
              </div>
            </div>

            {/* Identified Vendor */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                <Building className="w-3 h-3 text-purple-400" />
                Vendor Context
              </span>
              <div className="text-xs font-semibold text-zinc-200 truncate">
                {triage.vendor_name || "Auto-detected from ID"}
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
