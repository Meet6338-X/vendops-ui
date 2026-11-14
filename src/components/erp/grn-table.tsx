"use client";

import React from "react";
import Link from "next/link";
import { Search, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { GoodsReceiptNote } from "@/lib/schemas/erp";

interface GRNTableProps {
  grns: GoodsReceiptNote[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectPo: (poId: string) => void;
  onSelectVendor: (vendorId: string) => void;
  onInspectLines: (grn: GoodsReceiptNote) => void;
}

export function GRNTable({
  grns,
  isLoading,
  searchQuery,
  onSearchChange,
  onSelectPo,
  onSelectVendor,
  onInspectLines,
}: GRNTableProps) {
  const getDisputeLink = (grnId: string) => {
    if (grnId === "GRN-20240999") {
      return { threadId: "thread_mock_003_hitl", label: "HITL Dispute" };
    }
    if (grnId === "GRN-20240103" || grnId === "GRN-20240003") {
      return { threadId: "thread_mock_001_hinglish", label: "Short Payment Dispute" };
    }
    return null;
  };

  const filteredGRNs = grns.filter((g) => {
    return (
      g.grn_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.po_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.vendor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.lines.some((l) => l.item_sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by GRN ID, PO, vendor, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Showing {filteredGRNs.length} goods receipt notes
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">GRN Receipt ID</th>
              <th className="py-3 px-4">PO Reference</th>
              <th className="py-3 px-4">Vendor ID</th>
              <th className="py-3 px-4">Received Date</th>
              <th className="py-3 px-4 text-center">Lines</th>
              <th className="py-3 px-4">Dock Receiving Status</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono">
                  Loading goods receipts from ERP...
                </td>
              </tr>
            ) : filteredGRNs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400 font-mono">
                  No goods receipt notes found matching query.
                </td>
              </tr>
            ) : (
              filteredGRNs.map((grn) => {
                const totalRejected = grn.lines.reduce((acc, l) => acc + (l.rejected_qty || 0), 0);
                const hasRejections = totalRejected > 0;
                const dispute = getDisputeLink(grn.grn_id);

                return (
                  <tr key={grn.grn_id} className="hover:bg-zinc-800/40 transition-colors group">
                    {/* GRN ID */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-zinc-100">{grn.grn_id}</span>
                      {dispute && (
                        <div className="mt-1">
                          <Link
                            href={`/disputes/${encodeURIComponent(dispute.threadId)}`}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-orange-400 hover:underline bg-orange-950/40 px-1.5 py-0.5 rounded border border-orange-500/30"
                          >
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>{dispute.label}</span>
                          </Link>
                        </div>
                      )}
                    </td>

                    {/* PO Reference */}
                    <td className="py-3 px-4 font-mono">
                      <button
                        onClick={() => onSelectPo(grn.po_id)}
                        className="text-blue-400 hover:text-blue-300 font-medium hover:underline inline-flex items-center gap-1 group/btn"
                        title={`Filter POs by ${grn.po_id}`}
                      >
                        <span>{grn.po_id}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </button>
                    </td>

                    {/* Vendor ID */}
                    <td className="py-3 px-4 font-mono">
                      <button
                        onClick={() => onSelectVendor(grn.vendor_id)}
                        className="text-zinc-300 hover:text-white font-medium hover:underline"
                        title={`Filter Vendors by ${grn.vendor_id}`}
                      >
                        {grn.vendor_id}
                      </button>
                    </td>

                    {/* Received Date */}
                    <td className="py-3 px-4 text-[11px] font-mono text-zinc-400">
                      {grn.received_date}
                    </td>

                    {/* Lines Count */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[11px]">
                        {grn.lines.length} {grn.lines.length === 1 ? "item" : "items"}
                      </span>
                    </td>

                    {/* Dock Receiving Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {hasRejections ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-950/40 text-red-400 border border-red-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{totalRejected} Units Rejected</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>100% Accepted Clean</span>
                        </span>
                      )}
                    </td>

                    {/* Inspect */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onInspectLines(grn)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-mono transition-colors"
                      >
                        Inspect Intake
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
