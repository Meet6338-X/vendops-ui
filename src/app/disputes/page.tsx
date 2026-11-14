"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FilePlus2,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { listDisputes } from "@/lib/api/endpoints";
import { GlassPanel } from "@/components/shared/glass-panel";
import { DialectBadge } from "@/components/shared/dialect-badge";
import { cn } from "@/lib/utils";

export default function DisputesListPage() {
  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ["disputes-list"],
    queryFn: () => listDisputes(50),
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Dispute Resolution Ledger
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Browse and monitor autonomous vendor claims across Hinglish, Hindi, and English channels.
          </p>
        </div>

        <Link
          href="/disputes/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Submit New Claim</span>
        </Link>
      </div>

      {/* Main Disputes Table */}
      <GlassPanel className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-xs font-mono">Loading disputes ledger...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 text-xs">
            Failed to load disputes. Please refresh.
          </div>
        ) : !disputes || disputes.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-zinc-400">No disputes found in ledger.</p>
            <Link
              href="/disputes/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-blue-400 hover:bg-blue-950/40 border border-blue-800/40"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Create First Dispute</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase text-zinc-400">
                  <th className="py-3 px-4">Thread ID</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Dialect</th>
                  <th className="py-3 px-4">Dispute Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
                {disputes.map((item) => {
                  const isWaiting = item.status === "WAITING_APPROVAL";
                  const isResolved = item.status === "RESOLVED";

                  return (
                    <tr
                      key={item.thread_id}
                      className="hover:bg-zinc-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-zinc-200">
                        {item.thread_id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate font-sans text-zinc-300">
                        {item.message}
                      </td>
                      <td className="py-3.5 px-4">
                        <DialectBadge language={item.language} className="text-[10px] py-0 px-2" />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {item.dispute_type || "TRIAGING"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-100">
                        {item.amount != null
                          ? `$${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase",
                            isWaiting && "bg-orange-950/80 text-orange-300 border-orange-600/50",
                            isResolved && "bg-emerald-950/80 text-emerald-300 border-emerald-600/50",
                            !isWaiting && !isResolved && "bg-blue-950/80 text-blue-300 border-blue-600/50"
                          )}
                        >
                          {isWaiting ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-orange-400" />
                              <span>HITL GATE</span>
                            </>
                          ) : isResolved ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>RESOLVED</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                              <span>{item.status}</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/disputes/${encodeURIComponent(item.thread_id)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-blue-400 hover:text-white hover:bg-blue-600/20 border border-blue-600/30 transition-all group-hover:border-blue-500"
                        >
                          <span>Open Run</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
