"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Invoice } from "@/lib/schemas/erp";
import { formatCurrency } from "@/lib/utils";

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectPo: (poId: string) => void;
  onSelectVendor: (vendorId: string) => void;
  onInspectLines: (invoice: Invoice) => void;
}

export function InvoicesTable({
  invoices,
  isLoading,
  searchQuery,
  onSearchChange,
  onSelectPo,
  onSelectVendor,
  onInspectLines,
}: InvoicesTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </span>
        );
      case "DISPUTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <AlertTriangle className="w-3 h-3" /> DISPUTED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  // Known dispute mapping for cross-linking
  const getDisputeLink = (invoiceId: string) => {
    if (invoiceId === "INV-20240999") {
      return { threadId: "thread_mock_003_hitl", label: "HITL Dispute ($120k)" };
    }
    if (invoiceId === "INV-20240103" || invoiceId === "INV-20240003") {
      return { threadId: "thread_mock_001_hinglish", label: "Short Payment Dispute" };
    }
    if (invoiceId === "INV-20240101") {
      return { threadId: "thread_mock_002_english", label: "Payment Delay Dispute" };
    }
    return null;
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.po_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.vendor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.lines.some((l) =>
        l.item_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "ALL" || inv.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by invoice ID, PO, vendor, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "PENDING", "APPROVED", "DISPUTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                statusFilter === st
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">Invoice ID</th>
              <th className="py-3 px-4">PO Reference</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Dates</th>
              <th className="py-3 px-4 text-center">Lines</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4">Status & Dispute Link</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500 font-mono">
                  Loading invoices from ERP...
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-400 font-mono">
                  No invoices found matching query.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const dispute = getDisputeLink(inv.invoice_id);

                return (
                  <tr key={inv.invoice_id} className="hover:bg-zinc-800/40 transition-colors group">
                    {/* Invoice ID */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-zinc-100">{inv.invoice_id}</span>
                    </td>

                    {/* PO Reference (clickable cross-link) */}
                    <td className="py-3 px-4 font-mono">
                      <button
                        onClick={() => onSelectPo(inv.po_id)}
                        className="text-blue-400 hover:text-blue-300 font-medium hover:underline inline-flex items-center gap-1 group/btn"
                        title={`Filter POs by ${inv.po_id}`}
                      >
                        <span>{inv.po_id}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </button>
                    </td>

                    {/* Vendor ID (clickable cross-link) */}
                    <td className="py-3 px-4 font-mono">
                      <button
                        onClick={() => onSelectVendor(inv.vendor_id)}
                        className="text-zinc-300 hover:text-white font-medium hover:underline"
                        title={`Filter Vendors by ${inv.vendor_id}`}
                      >
                        {inv.vendor_id}
                      </button>
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4 text-[11px] font-mono text-zinc-400">
                      <div>Issued: {inv.invoice_date}</div>
                      <div className="text-zinc-500">Due: {inv.due_date}</div>
                    </td>

                    {/* Line Items Count */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[11px]">
                        {inv.lines.length} {inv.lines.length === 1 ? "line" : "lines"}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                      {formatCurrency(inv.total_amount, inv.currency)}
                    </td>

                    {/* Status & Dispute Cross-link */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        {getStatusBadge(inv.status)}
                        {dispute && (
                          <Link
                            href={`/disputes/${encodeURIComponent(dispute.threadId)}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-orange-400 hover:text-orange-300 hover:underline bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/30"
                          >
                            <ShieldAlert className="w-3 h-3" />
                            <span>{dispute.label}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onInspectLines(inv)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-mono transition-colors"
                      >
                        View Lines
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
