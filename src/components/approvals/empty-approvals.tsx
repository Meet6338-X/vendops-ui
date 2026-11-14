import React from "react";
import { ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";

interface EmptyApprovalsProps {
  onRefresh?: () => void;
  isFetching?: boolean;
}

export function EmptyApprovals({ onRefresh, isFetching }: EmptyApprovalsProps) {
  return (
    <div className="rounded-2xl bg-[#18181B]/80 backdrop-blur-md border border-zinc-700/40 p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto shadow-2xl">
      {/* Icon with glowing ring */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.2)]">
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#18181B]">
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 font-bold" />
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Zero Pending Interrupts
        </h3>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          All transactions within autonomous tolerance limits.
        </p>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left pt-2">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Autonomous Guard
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active &amp; Monitoring</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Value Ceiling
          </div>
          <div className="text-xs font-semibold text-zinc-200 mt-1 font-mono">
            $100,000.00 Limit
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Match Tolerance
          </div>
          <div className="text-xs font-semibold text-zinc-200 mt-1 font-mono">
            ±0.5% Allowed
          </div>
        </div>
      </div>

      {/* Re-poll queue button */}
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-400" : ""}`} />
          <span>Re-check Queue</span>
        </button>
      )}
    </div>
  );
}
