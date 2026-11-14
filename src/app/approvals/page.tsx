"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listPendingApprovals } from "@/lib/api/endpoints";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { EmptyApprovals } from "@/components/approvals/empty-approvals";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  Clock,
  Layers,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

export default function ApprovalsPage() {
  const {
    data: approvals,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["pending-approvals"],
    queryFn: listPendingApprovals,
    refetchInterval: 15000,
  });

  const pendingList = approvals || [];

  const totalAtRisk = pendingList.reduce((acc, curr) => {
    const val =
      curr.interrupt.amount ??
      curr.proposal?.amount ??
      curr.match_result?.billed_amount ??
      0;
    return acc + val;
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              HITL Review Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {pendingList.length} Pending
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400 font-sans">
            Human-in-the-Loop decision gateway for high-value or policy-discrepant disbursements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-400" : "text-zinc-400"}`}
            />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Pending Interrupts
            </span>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              {isLoading ? "—" : pendingList.length}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">Requires HITL Signoff</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Total Exposure at Risk
            </span>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              {isLoading ? "—" : formatCurrency(totalAtRisk)}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">Awaiting Release</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              High-Value Ceiling
            </span>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              $100,000.00
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">Intervention Threshold</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Target SLA
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-400 mt-0.5">
              &lt; 2 Hours
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">Director Signoff window</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#18181B]/60 border border-zinc-800 p-6 space-y-4 animate-pulse"
            >
              <div className="h-6 bg-zinc-800/80 rounded w-1/4" />
              <div className="h-20 bg-zinc-800/40 rounded w-full" />
              <div className="h-32 bg-zinc-800/20 rounded w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-red-950/20 border border-red-500/30 p-8 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              Unable to Load Approvals Queue
            </h3>
            <p className="text-xs text-red-300 font-mono">
              {(error as Error)?.message || "Internal connection error."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-900/40 border border-red-500/40 text-red-200 hover:bg-red-900/60 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : pendingList.length === 0 ? (
        <EmptyApprovals onRefresh={() => refetch()} isFetching={isFetching} />
      ) : (
        <div className="space-y-6">
          {pendingList.map((item) => (
            <ApprovalCard key={item.thread_id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
