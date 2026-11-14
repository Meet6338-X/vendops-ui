"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, ShieldCheck, Database } from "lucide-react";
import { KpiGrid } from "@/components/overview/kpi-grid";
import { TelemetryPanel } from "@/components/overview/telemetry-panel";
import { QuickActionBanner } from "@/components/overview/quick-action-banner";
import { RecentDisputesTable } from "@/components/overview/recent-disputes-table";

export default function OverviewDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Executive Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE TELEMETRY ACTIVE
            </span>
            <span className="text-xs font-mono text-zinc-500">•</span>
            <span className="text-xs font-mono text-zinc-400">AP DISPUTE HARNESS v1.0</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Executive AP Operations & Telemetry
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Real-time LangGraph agent supervision, automated 3-way ERP matching, and HITL governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/disputes/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all border border-blue-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Dispute</span>
          </Link>

          <Link
            href="/approvals"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-700/60 hover:border-orange-500/40 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>HITL Approvals</span>
          </Link>

          <Link
            href="/erp"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-700/60 hover:border-blue-500/40 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>ERP Explorer</span>
          </Link>
        </div>
      </div>

      {/* 4-Column KPI Grid */}
      <KpiGrid />

      {/* Quick Action Ingestion Banner */}
      <QuickActionBanner />

      {/* System Telemetry & Connectivity Panel */}
      <TelemetryPanel />

      {/* Recent Disputes & Ingestion Stream Table */}
      <RecentDisputesTable />
    </div>
  );
}
