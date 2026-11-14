"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/shared/glass-panel";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Code2,
  FileCode,
  AlertTriangle,
  Flame,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayerDetail {
  layer: number;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: "blue" | "emerald" | "orange";
  status: "ACTIVE" | "ENFORCING" | "ZERO_TOLERANCE";
  rules: string[];
  techSpec: string;
  description: string;
}

const DEFENSE_LAYERS: LayerDetail[] = [
  {
    layer: 1,
    name: "Schema Enforcement",
    subtitle: "Pydantic v2 extra='forbid' & Enum Conformance",
    icon: FileCode,
    accentColor: "blue",
    status: "ENFORCING",
    techSpec: "Pydantic v2 StrictBaseModel (extra='forbid') + ActionType Enum",
    description:
      "Every tool argument undergoes strict runtime schema validation before dispatch. Extraneous parameter injection is rejected at the deserialization boundary. For ERP mutation calls (execute_resolution), actions must strictly match the authorized ActionType enum—free-text mutations are prohibited.",
    rules: [
      "StrictBaseModel configured with model_config = ConfigDict(extra='forbid')",
      "Forbidden free-text mutations on execute_resolution tool",
      "Valid actions strictly restricted to: RELEASE_PAYMENT, PARTIAL_PAYMENT, HOLD_PAYMENT, REQUEST_INFO, ESCALATE_HUMAN, CREDIT_MEMO",
      "Rejects hallucinated tool parameter payloads before hitting business logic",
    ],
  },
  {
    layer: 2,
    name: "Provenance Verification",
    subtitle: "Dynamic Registry of User Input + Verified ERP Records",
    icon: Lock,
    accentColor: "emerald",
    status: "ZERO_TOLERANCE",
    techSpec: "Canonical Regex: (?:INV-\\d{8}|PO-\\d{8}|GRN-\\d{8}|VND-\\d{6})",
    description:
      "Guarantees that 100% of entity IDs passed to ERP tools originate from either the vendor's normalized message or previously verified ERP database responses. Dynamic registry tracks verified IDs through the LangGraph state machine. Zero fabricated IDs are permitted to reach the ERP layer.",
    rules: [
      "Regex ID validation for Invoices (INV-\\d{8}), POs (PO-\\d{8}), GRNs (GRN-\\d{8}), and Vendors (VND-\\d{6})",
      "Devanagari digit normalization (०-९ converted to 0-9) during initial ingestion",
      "Dynamic provenance registry in graph state updated with ERP read results",
      "Instant rejection of any ID not present in the provenance set: raises ProvenanceViolation",
    ],
  },
  {
    layer: 3,
    name: "Self-Correction Circuit Breaker",
    subtitle: "Maximum 2 Repair Attempts Before Mandatory Escalation",
    icon: Flame,
    accentColor: "orange",
    status: "ACTIVE",
    techSpec: "State repair_attempts <= 2 -> LangGraph interrupt() trigger",
    description:
      "When a tool call breaches Schema or Provenance validation, the harness intercepts the error and returns a structured feedback payload to the model for self-repair. If the model fails to produce a valid call within 2 attempts, the circuit breaker trips and mandates human AP escalation.",
    rules: [
      "Structured error diagnostics (ProvenanceViolation) fed back into prompt context",
      "Attempt 1/2: Model attempts self-repair using verified allowed_ids",
      "Attempt 2/2: Second failure immediately trips circuit breaker",
      "Tripped breaker forces execution into HITL human-in-the-loop review queue",
    ],
  },
];

export function DefenseLayersOverview() {
  const [selectedLayer, setSelectedLayer] = useState<number>(1);

  const activeLayer = DEFENSE_LAYERS.find((l) => l.layer === selectedLayer) || DEFENSE_LAYERS[0];

  return (
    <GlassPanel className="p-6 border-zinc-700/50 bg-[#18181B]/95">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Security Perimeter: 3-Layer Defense Architecture
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Multi-stage guard preventing prompt injection, hallucinated ERP mutations, and infinite repair loops.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PERIMETER: FULLY ARMED
          </span>
        </div>
      </div>

      {/* Layer Step Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {DEFENSE_LAYERS.map((layer) => {
          const Icon = layer.icon;
          const isSelected = selectedLayer === layer.layer;

          const colorStyles = {
            blue: "hover:border-blue-500/40 text-blue-400",
            emerald: "hover:border-emerald-500/40 text-emerald-400",
            orange: "hover:border-orange-500/40 text-orange-400",
          };

          return (
            <button
              key={layer.layer}
              onClick={() => setSelectedLayer(layer.layer)}
              className={cn(
                "p-4 rounded-xl text-left transition-all duration-200 border relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                isSelected
                  ? "bg-zinc-900 border-zinc-600 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-zinc-500/50"
                  : "bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900/80",
                colorStyles[layer.accentColor]
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-xs">
                    {layer.layer}
                  </span>
                  Layer {layer.layer}
                </span>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-mono font-bold border",
                    layer.accentColor === "blue" && "bg-blue-500/15 text-blue-300 border-blue-500/30",
                    layer.accentColor === "emerald" && "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                    layer.accentColor === "orange" && "bg-orange-500/15 text-orange-300 border-orange-500/30"
                  )}
                >
                  {layer.status}
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-2">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <h4 className="text-sm font-bold text-white font-sans">{layer.name}</h4>
              </div>

              <p className="mt-1 text-xs text-zinc-400 font-sans line-clamp-2">
                {layer.subtitle}
              </p>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Layer Technical Detail Drawer */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Layer {activeLayer.layer} Specifications
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                {activeLayer.name}
              </h3>
            </div>
            <p className="mt-2 text-xs text-zinc-300 font-sans leading-relaxed max-w-3xl">
              {activeLayer.description}
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-1 flex-shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Contract Specification
            </span>
            <code className="text-xs font-mono text-cyan-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
              {activeLayer.techSpec}
            </code>
          </div>
        </div>

        {/* Detailed Enforcement Rules */}
        <div className="mt-4">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Enforced Security Invariants:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeLayer.rules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs font-sans text-zinc-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
