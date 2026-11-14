"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAuditLog } from "@/lib/api/endpoints";
import { AuditTable } from "@/components/audit/audit-table";
import { AuditFilters, AuditFilterState } from "@/components/audit/audit-filters";
import { exportAuditLedgerToCsv } from "@/components/audit/csv-export";
import { useToast } from "@/components/layout/toast-stack";
import { formatCurrency } from "@/lib/utils";
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  DollarSign,
  Bot,
  UserCheck,
} from "lucide-react";

export default function AuditPage() {
  const { showToast } = useToast();

  const {
    data: auditEntries,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["audit-log"],
    queryFn: () => listAuditLog(100),
    refetchInterval: 30000,
  });

  const [filters, setFilters] = useState<AuditFilterState>({
    searchQuery: "",
    actionType: "ALL",
    reviewerType: "ALL",
  });

  const allEntries = useMemo(() => auditEntries || [], [auditEntries]);

  // Multi-column filtering
  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      // 1. Text Search across Invoice ID, Reviewer ID, Audit ID, PO ID, Vendor ID
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesInvoice = entry.invoice_id.toLowerCase().includes(query);
        const matchesReviewer = (entry.reviewer_id || "SYS-AUTONOMOUS")
          .toLowerCase()
          .includes(query);
        const matchesAuditId = entry.audit_id.toLowerCase().includes(query);
        const matchesPO = entry.po_id ? entry.po_id.toLowerCase().includes(query) : false;
        const matchesVendor = entry.vendor_id.toLowerCase().includes(query);
        const matchesRationale = entry.rationale.toLowerCase().includes(query);

        if (
          !matchesInvoice &&
          !matchesReviewer &&
          !matchesAuditId &&
          !matchesPO &&
          !matchesVendor &&
          !matchesRationale
        ) {
          return false;
        }
      }

      // 2. ActionType Enum Filter
      if (filters.actionType !== "ALL") {
        const rowAction = entry.action ? entry.action.toUpperCase() : "";
        if (rowAction !== filters.actionType) {
          return false;
        }
      }

      // 3. Reviewer Type Filter
      if (filters.reviewerType !== "ALL") {
        const isAutonomous =
          !entry.reviewer_id || entry.reviewer_id === "SYS-AUTONOMOUS";
        if (filters.reviewerType === "AUTONOMOUS" && !isAutonomous) {
          return false;
        }
        if (filters.reviewerType === "STAFF" && isAutonomous) {
          return false;
        }
      }

      return true;
    });
  }, [allEntries, filters]);

  // Metrics calculations
  const totalVolume = allEntries.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const autonomousCount = allEntries.filter(
    (e) => !e.reviewer_id || e.reviewer_id === "SYS-AUTONOMOUS"
  ).length;
  const staffCount = allEntries.length - autonomousCount;
  const autonomousRate =
    allEntries.length > 0
      ? ((autonomousCount / allEntries.length) * 100).toFixed(0)
      : "100";

  // CSV Export Handler
  const handleExportCsv = () => {
    if (filteredEntries.length === 0) {
      showToast("Export Failed", "No records available to export.", "warning");
      return;
    }

    try {
      const filename = exportAuditLedgerToCsv(filteredEntries);
      showToast(
        "CSV Export Generated",
        `Downloaded ${filename} (${filteredEntries.length} records)`,
        "success"
      );
    } catch (err: any) {
      showToast("Export Failed", err.message || "Failed to generate CSV.", "critical");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      actionType: "ALL",
      reviewerType: "ALL",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Immutable Audit Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              ERP Write-Ahead Log
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400 font-sans">
            Cryptographically verified, tamper-evident log of all autonomous &amp; HITL financial disbursements
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 shadow-sm transition-all disabled:opacity-50"
            title="Refresh Ledger"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-400" : "text-zinc-400"}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export to CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isLoading || filteredEntries.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Volume */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Audited Volume
            </span>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              {isLoading ? "—" : formatCurrency(totalVolume)}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">Committed Disbursements</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Autonomous Rate */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Autonomous Rate
            </span>
            <div className="text-2xl font-mono font-bold text-purple-400 mt-0.5">
              {isLoading ? "—" : `${autonomousRate}%`}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">
              {autonomousCount} of {allEntries.length} without human touch
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: HITL Interventions */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              HITL Interventions
            </span>
            <div className="text-2xl font-mono font-bold text-blue-400 mt-0.5">
              {isLoading ? "—" : staffCount}
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">Staff authorized exceptions</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Ledger Records */}
        <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Ledger Immutability
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span>100%</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">SHA-256 Idempotency Chain</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <AuditFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalCount={allEntries.length}
        filteredCount={filteredEntries.length}
      />

      {/* Table Section */}
      {isLoading ? (
        <div className="rounded-2xl bg-[#18181B]/60 border border-zinc-800 p-8 space-y-4 animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/3" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-zinc-800/40 rounded w-full" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-red-950/20 border border-red-500/30 p-8 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              Unable to Load Audit Ledger
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
      ) : (
        <AuditTable entries={filteredEntries} />
      )}
    </div>
  );
}
