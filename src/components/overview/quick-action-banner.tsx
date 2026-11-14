"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, ArrowRight, ShieldCheck, Database, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";

export function QuickActionBanner() {
  return (
    <GlassPanel
      variant="glow"
      glowColor="blue"
      className="p-5 sm:p-6 border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-[#18181B]/95 to-zinc-900/90 relative overflow-hidden"
    >
      {/* Background visual accents */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-40 -bottom-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              AUTONOMOUS DISPUTE INGESTION
            </span>
            <span className="text-xs font-mono text-zinc-400">
              LangGraph Multi-Turn Engine
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Ingest or Simulate a Vendor AP Dispute
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Feed raw vendor communication in <span className="text-cyan-300 font-medium">Hinglish</span>,{" "}
            <span className="text-amber-300 font-medium">Hindi (Devanagari)</span>, or{" "}
            <span className="text-blue-300 font-medium">English</span>. The agent normalizes tokens, executes 3-way ERP reconciliation against purchase orders and dock receipts, and generates policy-compliant resolutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/disputes/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all active:scale-[0.98] border border-blue-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch New Dispute Run</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/approvals"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 font-medium text-sm border border-zinc-700/60 hover:border-orange-500/40 hover:text-orange-300 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Review HITL Approvals</span>
          </Link>

          <Link
            href="/erp"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 font-medium text-sm border border-zinc-700/60 hover:border-blue-500/40 hover:text-blue-300 transition-colors"
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Explore ERP Data</span>
          </Link>
        </div>
      </div>
    </GlassPanel>
  );
}
