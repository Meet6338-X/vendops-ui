"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Bug,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";

interface GuardEventsCardProps {
  toolCallErrors?: string[];
  repairAttempts?: number;
  guardEvents?: Array<{
    timestamp?: string;
    tool_name?: string;
    rejected_id?: string;
    status?: string;
    message?: string;
  }>;
}

export function GuardEventsCard({
  toolCallErrors = [],
  repairAttempts = 0,
  guardEvents = [],
}: GuardEventsCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const hasViolations =
    toolCallErrors.length > 0 || repairAttempts > 0 || guardEvents.length > 0;

  return (
    <GlassPanel className="p-4 transition-all">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          {hasViolations ? (
            <ShieldAlert className="w-4 h-4 text-orange-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            Guard Events & Hallucination Interceptors
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase ${
              hasViolations
                ? "bg-orange-950/80 text-orange-300 border-orange-600/50"
                : "bg-emerald-950/60 text-emerald-400 border-emerald-600/40"
            }`}
          >
            {hasViolations ? "Interventions Logged" : "0 Violations"}
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
          {!hasViolations ? (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="font-semibold text-emerald-300">All Semantic & Provenance Guards Cleared</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  100% of ERP tool arguments were verified against incoming message provenance. No synthetic hallucination detected.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Repair Attempts Banner */}
              {repairAttempts > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-950/30 border border-orange-500/40 text-xs text-orange-200">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                    <span>Self-Correction Repair Attempts:</span>
                  </div>
                  <span className="font-mono font-bold text-orange-300">{repairAttempts} executed</span>
                </div>
              )}

              {/* Tool Errors */}
              {toolCallErrors.map((err, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200"
                >
                  <Bug className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-red-300">Tool Schema Violation: </span>
                    <span>{err}</span>
                  </div>
                </div>
              ))}

              {/* Guard Events from interceptor */}
              {guardEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-orange-500/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">
                      Tool: {evt.tool_name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-950 text-red-300 border border-red-800">
                      {evt.status || "BLOCKED"}
                    </span>
                  </div>
                  <div className="text-zinc-200 text-xs">{evt.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </GlassPanel>
  );
}
