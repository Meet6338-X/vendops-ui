"use client";

import React, { useState } from "react";
import {
  Scale,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  PackageCheck,
  Receipt,
  FileText,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { ThreeWayMatchResult } from "@/lib/schemas/dispute";
import { cn } from "@/lib/utils";

interface ThreeWayMatchTableProps {
  matchResult?: ThreeWayMatchResult | null;
}

export function ThreeWayMatchTable({ matchResult }: ThreeWayMatchTableProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!matchResult) {
    return (
      <GlassPanel className="p-4 opacity-75">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-400">3-Way ERP Reconciliation</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Awaiting ERP query node...</span>
        </div>
      </GlassPanel>
    );
  }

  const isPerfectMatch = matchResult.status === "PERFECT_MATCH";
  const hasDiscrepancy = (matchResult.discrepancies && matchResult.discrepancies.length > 0) || !isPerfectMatch;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PERFECT_MATCH":
        return {
          label: "PERFECT MATCH",
          style: "bg-emerald-950/80 text-emerald-300 border-emerald-600/50",
          icon: CheckCircle2,
        };
      case "PRICE_DISCREPANCY":
        return {
          label: "PRICE DISCREPANCY",
          style: "bg-orange-950/80 text-orange-300 border-orange-600/50",
          icon: AlertTriangle,
        };
      case "QUANTITY_DISCREPANCY":
        return {
          label: "QUANTITY DISCREPANCY",
          style: "bg-orange-950/80 text-orange-300 border-orange-600/50",
          icon: AlertTriangle,
        };
      case "MISSING_RECEIPT":
        return {
          label: "MISSING DOCK GRN",
          style: "bg-red-950/80 text-red-300 border-red-600/50",
          icon: AlertTriangle,
        };
      default:
        return {
          label: status,
          style: "bg-zinc-800 text-zinc-300 border-zinc-700",
          icon: AlertTriangle,
        };
    }
  };

  const badgeInfo = getStatusBadge(matchResult.status);
  const BadgeIcon = badgeInfo.icon;

  const delta = Math.abs(matchResult.billed_amount - matchResult.authorized_amount);

  return (
    <GlassPanel className="p-4 transition-all">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            3-Way ERP Match (PO vs GRN vs Invoice)
          </h3>
          <span
            className={cn(
              "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase",
              badgeInfo.style
            )}
          >
            <BadgeIcon className="w-3 h-3" />
            {badgeInfo.label}
          </span>
        </div>

        <button
          type="button"
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 pt-3 border-t border-zinc-800/80">
          {/* Discrepancies Alerts */}
          {hasDiscrepancy && matchResult.discrepancies.length > 0 && (
            <div className="space-y-2">
              {matchResult.discrepancies.map((disc, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-950/30 border border-orange-500/40 text-xs text-orange-200"
                >
                  <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-orange-300">Reconciliation Mismatch: </span>
                    <span>{disc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3 Documents Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Purchase Order */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium text-purple-300">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  PO Contract
                </span>
                <span className="font-mono text-[11px] text-zinc-500">{matchResult.po_id}</span>
              </div>
              <div className="pt-1">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Authorized Baseline</div>
                <div className="text-base font-mono font-bold text-zinc-100">
                  ${matchResult.authorized_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* 2. Goods Receipt Note */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium text-emerald-300">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                  GRN Dock Intake
                </span>
                <span className="font-mono text-[11px] text-zinc-500">
                  {matchResult.grn_id || "NOT RECEIVED"}
                </span>
              </div>
              <div className="pt-1">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Dock Inspection</div>
                <div className="text-base font-mono font-bold text-emerald-400">
                  {matchResult.grn_id ? "Verified Intake" : "Missing / Unverified"}
                </div>
              </div>
            </div>

            {/* 3. Vendor Invoice */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium text-blue-300">
                  <Receipt className="w-3.5 h-3.5 text-blue-400" />
                  Vendor Invoice
                </span>
                <span className="font-mono text-[11px] text-zinc-500">{matchResult.invoice_id}</span>
              </div>
              <div className="pt-1">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Claimed Amount</div>
                <div className="text-base font-mono font-bold text-zinc-100">
                  ${matchResult.billed_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Variance Summary Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
            <span className="text-zinc-400 font-medium">Reconciliation Variance:</span>
            <div className="flex items-center gap-3">
              {delta > 0 ? (
                <span className="font-mono font-semibold text-orange-400">
                  Variance: ${delta.toLocaleString("en-US", { minimumFractionDigits: 2 })} Disputed
                </span>
              ) : (
                <span className="font-mono font-semibold text-emerald-400">
                  Zero Variance ($0.00) — Perfectly Balanced
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
