"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { DialectBadge } from "@/components/shared/dialect-badge";
import { listDisputes } from "@/lib/api/endpoints";
import { DisputeListItem } from "@/lib/schemas/dispute";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export function RecentDisputesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const {
    data: disputes,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["disputes"],
    queryFn: () => listDisputes(),
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> RESOLVED
          </span>
        );
      case "WAITING_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-orange-500/15 text-orange-400 border border-orange-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> WAITING APPROVAL
          </span>
        );
      case "INITIALIZED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" /> INITIALIZED
          </span>
        );
      case "ESCALATED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertCircle className="w-3 h-3" /> ESCALATED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority?: string | null) => {
    switch (priority?.toUpperCase()) {
      case "URGENT":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/60 text-red-400 border border-red-600/40">
            URGENT
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950/50 text-orange-400 border border-orange-500/30">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-950/40 text-blue-300 border border-blue-600/30">
            MEDIUM
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
            LOW
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (type?: string | null) => {
    if (!type) return <span className="text-zinc-500 text-xs">—</span>;
    const label = type.replace(/_/g, " ");
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
        {label}
      </span>
    );
  };

  const filteredDisputes = (disputes || []).filter((item: DisputeListItem) => {
    const matchesSearch =
      item.thread_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sender && item.sender.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.dispute_type && item.dispute_type.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "APPROVAL" && item.status === "WAITING_APPROVAL") ||
      (statusFilter === "RESOLVED" && item.status === "RESOLVED") ||
      (statusFilter === "ACTIVE" && item.status !== "RESOLVED");

    return matchesSearch && matchesStatus;
  });

  return (
    <GlassPanel className="p-5 border-zinc-800/80 bg-[#18181B]/80 space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-white">
              Recent Dispute Runs & Ingestion Log
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              {filteredDisputes.length} active
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time execution log of agentic triage, 3-way match, and policy resolution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search thread, message, sender..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
            {[
              { id: "ALL", label: "All" },
              { id: "APPROVAL", label: "Waiting HITL" },
              { id: "RESOLVED", label: "Resolved" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === tab.id
                    ? "bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
            title="Refresh disputes"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Failed to load recent disputes: {error instanceof Error ? error.message : "Unknown error"}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded bg-red-900/40 hover:bg-red-900/70 text-red-200 border border-red-500/40"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-2 py-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-xl bg-zinc-900/50 animate-pulse border border-zinc-800" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredDisputes.length === 0 && (
        <div className="py-12 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 mx-auto flex items-center justify-center text-zinc-500">
            <HelpCircle className="w-5 h-5" />
          </div>
          <p className="text-sm text-zinc-400">No disputes match your current filter or query.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
            className="text-xs text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && filteredDisputes.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Thread ID & Time</th>
                <th className="py-3 px-4 min-w-[260px]">Incoming Query (Multilingual)</th>
                <th className="py-3 px-4">Dialect</th>
                <th className="py-3 px-4">Triage & Priority</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredDisputes.map((dispute: DisputeListItem) => (
                <tr
                  key={dispute.thread_id}
                  className="hover:bg-zinc-800/40 transition-colors group"
                >
                  {/* Thread ID & Time */}
                  <td className="py-3.5 px-4 font-mono">
                    <Link
                      href={`/disputes/${encodeURIComponent(dispute.thread_id)}`}
                      className="text-blue-400 hover:text-blue-300 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>{dispute.thread_id}</span>
                    </Link>
                    <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
                      {formatRelativeTime(dispute.created_at)}
                    </div>
                  </td>

                  {/* Multilingual Query Excerpt (Devanagari/Hinglish safe with font-sans leading-relaxed) */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <p
                      className="font-sans text-xs text-zinc-200 leading-relaxed line-clamp-2"
                      title={dispute.message}
                    >
                      {dispute.message}
                    </p>
                    {dispute.sender && (
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate">
                        From: {dispute.sender}
                      </p>
                    )}
                  </td>

                  {/* Detected Dialect */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <DialectBadge language={dispute.language} />
                  </td>

                  {/* Triage & Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      {getCategoryBadge(dispute.dispute_type)}
                      {getPriorityBadge(dispute.priority)}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                    <div className="text-zinc-100 font-semibold">
                      {formatCurrency(dispute.amount)}
                    </div>
                    {dispute.action && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {dispute.action}
                      </span>
                    )}
                  </td>

                  {/* Status Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(dispute.status)}
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/disputes/${encodeURIComponent(dispute.thread_id)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-blue-600/20 text-zinc-300 hover:text-blue-300 border border-zinc-700/60 hover:border-blue-500/40 text-xs font-medium transition-colors"
                    >
                      <span>View Run</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassPanel>
  );
}
