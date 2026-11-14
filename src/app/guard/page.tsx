"use client";

import React from "react";
import { DefenseLayersOverview } from "@/components/guard/defense-layers-overview";
import { GuardEventTimeline } from "@/components/guard/guard-event-timeline";
import { ProvenanceSandbox } from "@/components/guard/provenance-sandbox";
import { ShieldAlert, Lock, CheckCircle2, Flame } from "lucide-react";

export default function GuardPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3 font-sans">
                Tool-Call Guard & Provenance Inspector
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  ZERO-HALLUCINATION ENFORCED
                </span>
              </h1>
              <p className="text-sm text-zinc-400 font-sans mt-0.5">
                Deterministic 3-layer security perimeter preventing prompt injection, unverified ERP mutations, and infinite repair loops.
              </p>
            </div>
          </div>
        </div>

        {/* Global Security Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            Layer 1: Schema Guard
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Layer 2: Provenance
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Layer 3: Circuit Breaker
          </span>
        </div>
      </div>

      {/* 1. Security Perimeter: 3-Layer Defense Overview */}
      <DefenseLayersOverview />

      {/* 2. Interactive Provenance Visualizer Sandbox */}
      <ProvenanceSandbox />

      {/* 3. Guard Interception Timeline (Consumes listGuardEvents()) */}
      <GuardEventTimeline />
    </div>
  );
}
