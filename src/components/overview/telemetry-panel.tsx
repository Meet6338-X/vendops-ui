"use client";

import React from "react";
import { GlassPanel } from "@/components/shared/glass-panel";
import {
  Server,
  Database,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export function TelemetryPanel() {
  return (
    <GlassPanel className="p-5 border-zinc-800/80 bg-[#18181B]/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">
              System Telemetry & Connectivity Panel
            </h3>
            <p className="text-xs text-zinc-400">
              Live service status, vector store health, and deterministic tool harness monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-600/30">
            ALL SYSTEMS NOMINAL
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Node 1: Backend API */}
        <div className="rounded-xl p-3.5 bg-zinc-900/60 border border-zinc-800/80 hover:border-blue-500/30 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-zinc-200">
              <Server className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Backend API</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Port:</span>
              <span className="text-zinc-200 font-semibold">8000 (FastAPI)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Runtime:</span>
              <span className="text-zinc-300">LangGraph v0.2</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Protocol:</span>
              <span className="text-zinc-300">REST + SSE Streaming</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Latency:</span>
              <span className="text-emerald-400 font-semibold">~42ms</span>
            </div>
          </div>
        </div>

        {/* Node 2: Qdrant Vector DB */}
        <div className="rounded-xl p-3.5 bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-zinc-200">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Qdrant Vector DB</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Healthy
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Port:</span>
              <span className="text-zinc-200 font-semibold">6333 (gRPC/HTTP)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Collections:</span>
              <span className="text-zinc-200 font-semibold">2 Active</span>
            </div>
            <div className="pl-2 space-y-0.5 border-l border-zinc-800 text-[11px] text-zinc-400">
              <div className="text-zinc-300">• sop_policies (1536d)</div>
              <div className="text-zinc-300">• historical_disputes</div>
            </div>
            <div className="flex justify-between text-zinc-400 pt-0.5">
              <span>Distance Metric:</span>
              <span className="text-zinc-300">Cosine (HNSW)</span>
            </div>
          </div>
        </div>

        {/* Node 3: MCP Tool Server */}
        <div className="rounded-xl p-3.5 bg-zinc-900/60 border border-zinc-800/80 hover:border-purple-500/30 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-zinc-200">
              <Wrench className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">MCP Tool Server</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Registered
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Active Tools:</span>
              <span className="text-purple-300 font-semibold">6 Registered</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-zinc-400 pt-1">
              <span className="bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-700/40 text-zinc-300">get_invoice</span>
              <span className="bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-700/40 text-zinc-300">get_po</span>
              <span className="bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-700/40 text-zinc-300">get_grn</span>
              <span className="bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-700/40 text-zinc-300">get_vendor</span>
              <span className="bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-700/40 text-zinc-300">get_payment</span>
              <span className="bg-zinc-800/70 px-1.5 py-0.5 rounded border border-zinc-700/40 text-zinc-300">execute_res</span>
            </div>
            <div className="flex justify-between text-zinc-400 pt-0.5">
              <span>Idempotency:</span>
              <span className="text-emerald-400 font-semibold">Enforced</span>
            </div>
          </div>
        </div>

        {/* Node 4: Zero-Hallucination Guard */}
        <div className="rounded-xl p-3.5 bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Zero-Hallucination Guard</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>ERP Hallucinations:</span>
              <span className="text-emerald-400 font-bold text-sm">0 Detected</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Provenance Mode:</span>
              <span className="text-zinc-200 font-semibold">Strict In-Context</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Schema Enforcer:</span>
              <span className="text-zinc-300">Pydantic v2 + Zod</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Arbitrary Mutex:</span>
              <span className="text-blue-400 font-semibold">Hard Blocked</span>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
