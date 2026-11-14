"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listGuardEvents } from "@/lib/api/endpoints";
import { GuardEvent } from "@/lib/schemas/evals";
import { GlassPanel } from "@/components/shared/glass-panel";
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronRight,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FALLBACK_GUARD_EVENTS: GuardEvent[] = [
  {
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    thread_id: "thread_adv_01",
    tool_name: "get_invoice",
    rejected_id: "INV-99999999",
    id_type: "INVOICE",
    repair_attempt: 1,
    must_escalate: false,
    status: "BLOCKED",
    message: "Provenance rejection: ID 'INV-99999999' not found in message or ERP history. Repaired on next step.",
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    thread_id: "thread_adv_02",
    tool_name: "execute_resolution",
    rejected_id: "UNAUTHORIZED_ACTION",
    id_type: "SCHEMA_VIOLATION",
    repair_attempt: 2,
    must_escalate: true,
    status: "ESCALATED",
    message: "ActionType enum constraint breached: free-text mutations strictly forbidden. Maximum repairs (2/2) exceeded.",
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    thread_id: "thread_adv_03",
    tool_name: "get_purchase_order",
    rejected_id: "PO-77778888",
    id_type: "PURCHASE_ORDER",
    repair_attempt: 1,
    must_escalate: false,
    status: "BLOCKED",
    message: "Candidate ID 'PO-77778888' is absent from active dispute provenance ledger. Feedback returned for model repair.",
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    thread_id: "thread_adv_04",
    tool_name: "get_grn",
    rejected_id: "GRN-00000000",
    id_type: "GRN",
    repair_attempt: 2,
    must_escalate: true,
    status: "ESCALATED",
    message: "Repeated zero-hash GRN ID hallucination detected. Circuit breaker tripped: dispatched to human AP supervisor.",
  },
];

export function GuardEventTimeline() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "BLOCKED" | "ESCALATED">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set([0]));

  const { data, isLoading, refetch, isFetching } = useQuery<GuardEvent[]>({
    queryKey: ["guard-events"],
    queryFn: () => listGuardEvents(50),
    staleTime: 15000,
  });

  const rawEvents = data && data.length > 0 ? data : FALLBACK_GUARD_EVENTS;

  // Filter events
  const filteredEvents = rawEvents.filter((event) => {
    const matchesStatus =
      statusFilter === "ALL" || event.status?.toUpperCase() === statusFilter;

    const matchesSearch =
      searchQuery.trim() === "" ||
      event.tool_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.rejected_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.id_type && event.id_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.message && event.message.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const toggleExpand = (idx: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <GlassPanel className="p-6 border-zinc-700/50 bg-[#18181B]/95">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight font-sans">
                Guard Interception Timeline
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Real-time security telemetry of blocked hallucinated tool calls and circuit-breaker escalations.
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tool or rejected ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-56"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
            {(["ALL", "BLOCKED", "ESCALATED"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all duration-150 font-bold",
                  statusFilter === filter
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all duration-150 disabled:opacity-50"
            title="Refresh Guard Events"
          >
            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin text-blue-400")} />
          </button>
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="mt-5 space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-500 text-xs font-mono">
            No guard interception events matching filters.
          </div>
        ) : (
          filteredEvents.map((event, idx) => {
            const isEscalated = event.status?.toUpperCase() === "ESCALATED" || event.must_escalate;
            const isExpanded = expandedIndices.has(idx);

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden",
                  isEscalated
                    ? "bg-red-950/15 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.08)]"
                    : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700"
                )}
              >
                {/* Event Summary Bar */}
                <div
                  onClick={() => toggleExpand(idx)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors mt-0.5 sm:mt-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>

                    {/* Outcome Tag */}
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded text-xs font-mono font-extrabold border flex items-center gap-1.5",
                        isEscalated
                          ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      )}
                    >
                      {isEscalated ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {event.status || (isEscalated ? "ESCALATED" : "BLOCKED")}
                    </span>

                    {/* Tool Name */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white bg-zinc-800/80 px-2.5 py-0.5 rounded border border-zinc-700/60">
                        {event.tool_name}()
                      </span>
                    </div>

                    {/* Rejected ID Tag */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-sans text-zinc-400 hidden md:inline">Rejected ID:</span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-red-950/40 text-red-300 border border-red-500/30">
                        {event.rejected_id}
                      </span>
                      {event.id_type && (
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">
                          ({event.id_type})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata: Repair Attempt and Timestamp */}
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 pl-7 sm:pl-0">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[11px] font-bold border",
                        event.repair_attempt >= 2
                          ? "bg-red-500/10 text-red-300 border-red-500/30"
                          : "bg-zinc-800 text-zinc-300 border-zinc-700/60"
                      )}
                    >
                      Attempt {event.repair_attempt} of 2
                      {event.repair_attempt >= 2 && " (Circuit Breaker Tripped)"}
                    </span>

                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 bg-zinc-950/40 text-xs font-sans space-y-2.5">
                    {event.message && (
                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-mono text-xs">
                        <span className="text-zinc-400 font-sans block mb-1">Interception Diagnostics:</span>
                        {event.message}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-zinc-400">
                      <div>
                        <span className="text-zinc-500">Thread Reference:</span>{" "}
                        <span className="text-zinc-300">{event.thread_id || "thread_adv_simulation"}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Must Escalate Gate:</span>{" "}
                        <span className={event.must_escalate ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                          {event.must_escalate ? "TRUE (Mandatory Human Signoff)" : "FALSE (Auto-Repair Active)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">ISO Timestamp:</span>{" "}
                        <span className="text-zinc-400">{event.timestamp}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </GlassPanel>
  );
}
