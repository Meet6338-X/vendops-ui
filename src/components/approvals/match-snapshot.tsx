import React from "react";
import { ThreeWayMatchResult } from "@/lib/schemas/dispute";
import { formatCurrency, cn } from "@/lib/utils";
import {
  FileText,
  PackageCheck,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface MatchSnapshotProps {
  matchResult: ThreeWayMatchResult | null | undefined;
  className?: string;
}

const MATCH_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PERFECT_MATCH: {
    label: "3-Way Match Verified",
    bg: "bg-emerald-950/40",
    text: "text-emerald-300",
    border: "border-emerald-600/40",
    icon: CheckCircle2,
  },
  PRICE_DISCREPANCY: {
    label: "Price Discrepancy",
    bg: "bg-amber-950/40",
    text: "text-amber-300",
    border: "border-amber-600/40",
    icon: AlertTriangle,
  },
  QUANTITY_DISCREPANCY: {
    label: "Quantity Discrepancy",
    bg: "bg-orange-950/40",
    text: "text-orange-300",
    border: "border-orange-600/40",
    icon: AlertTriangle,
  },
  MISSING_RECEIPT: {
    label: "Missing GRN Receipt",
    bg: "bg-red-950/40",
    text: "text-red-300",
    border: "border-red-600/40",
    icon: XCircle,
  },
  ALREADY_PAID: {
    label: "Already Paid / Settled",
    bg: "bg-blue-950/40",
    text: "text-blue-300",
    border: "border-blue-600/40",
    icon: CheckCircle2,
  },
  NOT_FOUND: {
    label: "ERP Records Not Found",
    bg: "bg-zinc-900/60",
    text: "text-zinc-400",
    border: "border-zinc-700/50",
    icon: HelpCircle,
  },
};

export function MatchSnapshot({ matchResult, className }: MatchSnapshotProps) {
  if (!matchResult) {
    return (
      <div
        className={cn(
          "rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-xs text-zinc-500 font-mono",
          className
        )}
      >
        No 3-way match reconciliation data attached.
      </div>
    );
  }

  const statusKey = matchResult.status || (matchResult.is_matched ? "PERFECT_MATCH" : "PRICE_DISCREPANCY");
  const statusCfg = MATCH_STATUS_CONFIG[statusKey] || MATCH_STATUS_CONFIG["PRICE_DISCREPANCY"];
  const StatusIcon = statusCfg.icon;

  const billedAmount = matchResult.billed_amount ?? 0;
  const authorizedAmount = matchResult.authorized_amount ?? 0;
  const variance = billedAmount - authorizedAmount;

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-4",
        className
      )}
    >
      {/* Header with status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            3-Way Match Reconciliation
          </span>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border",
            statusCfg.bg,
            statusCfg.text,
            statusCfg.border
          )}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{statusCfg.label}</span>
        </div>
      </div>

      {/* 3 Nodes: PO -> GRN -> Invoice */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Purchase Order */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Purchase Order</span>
          </div>
          <div className="font-mono text-xs font-semibold text-zinc-200 truncate">
            {matchResult.po_id || "PO-UNLINKED"}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Authorized Contract</div>
        </div>

        {/* Goods Receipt Note */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Goods Receipt (GRN)</span>
          </div>
          <div className="font-mono text-xs font-semibold text-zinc-200 truncate">
            {matchResult.grn_id ? (
              matchResult.grn_id
            ) : (
              <span className="text-red-400">Intake Pending / Missing</span>
            )}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Dock Receiving Intake</div>
        </div>

        {/* Invoice */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Vendor Invoice</span>
          </div>
          <div className="font-mono text-xs font-semibold text-zinc-200 truncate">
            {matchResult.invoice_id || "INV-UNKNOWN"}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Billed Claim</div>
        </div>
      </div>

      {/* Financial Comparison: Billed vs Authorized */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Invoice Billed
          </div>
          <div className="font-mono text-sm font-bold text-zinc-200 mt-0.5">
            {formatCurrency(billedAmount)}
          </div>
        </div>

        <div className="px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            ERP Authorized
          </div>
          <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5">
            {formatCurrency(authorizedAmount)}
          </div>
        </div>

        <div className="px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
            Variance at Stake
          </div>
          <div
            className={cn(
              "font-mono text-sm font-bold mt-0.5",
              variance === 0
                ? "text-zinc-400"
                : variance > 0
                ? "text-amber-400"
                : "text-red-400"
            )}
          >
            {variance > 0 ? `+${formatCurrency(variance)}` : formatCurrency(variance)}
          </div>
        </div>
      </div>

      {/* Discrepancies Callout */}
      {matchResult.discrepancies && matchResult.discrepancies.length > 0 ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Identified Reconciliation Discrepancies:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-amber-200/90 pl-1">
            {matchResult.discrepancies.map((disc, idx) => (
              <li key={idx} className="font-sans leading-relaxed">
                {disc}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-2.5">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Zero discrepancy between dock inspection and invoice pricing lines.</span>
        </div>
      )}
    </div>
  );
}
