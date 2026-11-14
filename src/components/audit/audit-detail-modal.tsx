"use client";

import React, { useState } from "react";
import { AuditEntry } from "@/lib/schemas/erp";
import { formatCurrency, formatKolkataTime, formatRelativeTime } from "@/lib/utils";
import { ActionBadge } from "../approvals/action-badge";
import {
  X,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  FileSpreadsheet,
  Receipt,
  FileText,
  Building2,
  DollarSign,
  UserCheck,
  Bot,
  KeyRound,
} from "lucide-react";

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: AuditEntry | null;
}

export function AuditDetailModal({
  isOpen,
  onClose,
  entry,
}: AuditDetailModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !entry) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isAutonomous = !entry.reviewer_id || entry.reviewer_id === "SYS-AUTONOMOUS";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#18181B] border border-zinc-700/60 shadow-2xl z-10 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Immutable Audit Record
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                {entry.audit_id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Top Banner: Authorized Amount & Action */}
          <div className="rounded-xl bg-zinc-950/70 border border-zinc-800/90 p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-0.5">
                Authorized Amount
              </span>
              <div className="text-3xl font-mono font-bold text-white tracking-tight">
                {formatCurrency(entry.amount)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                Committed Action
              </span>
              <ActionBadge action={entry.action} size="lg" />
            </div>
          </div>

          {/* Key Entities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Invoice ID */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Invoice ID:</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono font-semibold text-zinc-200">
                <span>{entry.invoice_id}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(entry.invoice_id, "invoice")}
                  className="text-zinc-500 hover:text-zinc-300"
                  title="Copy Invoice ID"
                >
                  {copiedKey === "invoice" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* PO ID */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Purchase Order:</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono font-semibold text-zinc-200">
                <span>{entry.po_id || "—"}</span>
                {entry.po_id && (
                  <button
                    type="button"
                    onClick={() => handleCopy(entry.po_id!, "po")}
                    className="text-zinc-500 hover:text-zinc-300"
                    title="Copy PO ID"
                  >
                    {copiedKey === "po" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Vendor ID */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Vendor Account:</span>
              </div>
              <span className="font-mono font-semibold text-zinc-200">
                {entry.vendor_id}
              </span>
            </div>

            {/* Reviewer / Authorizer */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                {isAutonomous ? (
                  <Bot className="w-4 h-4 text-purple-400" />
                ) : (
                  <UserCheck className="w-4 h-4 text-blue-400" />
                )}
                <span>Reviewer Authority:</span>
              </div>
              <span
                className={`font-mono text-xs px-2 py-0.5 rounded ${
                  isAutonomous
                    ? "bg-purple-950/40 text-purple-300 border border-purple-500/30"
                    : "bg-blue-950/40 text-blue-300 border border-blue-500/30"
                }`}
              >
                {entry.reviewer_id || "SYS-AUTONOMOUS"}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Ledger Commit Timestamp:</span>
              </span>
              <span className="font-mono font-semibold text-zinc-200">
                {formatKolkataTime(entry.timestamp)} (IST)
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>ISO UTC:</span>
              <span>{entry.timestamp}</span>
            </div>
          </div>

          {/* Idempotency Key */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5 font-mono text-[11px] uppercase">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Idempotency Key (Deduplication Lock)</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(entry.idempotency_key, "idemp")}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white"
              >
                {copiedKey === "idemp" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Key</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs text-zinc-300 break-all select-all pt-0.5">
              {entry.idempotency_key}
            </div>
          </div>

          {/* Rationale */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 block">
              Execution Rationale &amp; Evidence
            </span>
            <p className="text-xs font-sans text-zinc-200 leading-relaxed">
              {entry.rationale}
            </p>
          </div>

          {/* Immutability Seal */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Cryptographically sealed in append-only ERP audit ledger. Non-repudiable state record.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
