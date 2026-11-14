"use client";

import React from "react";
import Link from "next/link";
import { Search, ShieldAlert } from "lucide-react";
import { PurchaseOrder } from "@/lib/schemas/erp";
import { formatCurrency } from "@/lib/utils";

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectVendor: (vendorId: string) => void;
  onFindInvoices: (poId: string) => void;
  onFindGRNs: (poId: string) => void;
  onInspectLines: (po: PurchaseOrder) => void;
}

export function PurchaseOrdersTable({
  purchaseOrders,
  isLoading,
  searchQuery,
  onSearchChange,
  onSelectVendor,
  onFindInvoices,
  onFindGRNs,
  onInspectLines,
}: PurchaseOrdersTableProps) {
  const getDisputeLink = (poId: string) => {
    if (poId === "PO-20240999") {
      return { threadId: "thread_mock_003_hitl", label: "HITL Dispute ($120k)" };
    }
    if (poId === "PO-20240103" || poId === "PO-20240003") {
      return { threadId: "thread_mock_001_hinglish", label: "Short Payment Dispute" };
    }
    if (poId === "PO-20240101") {
      return { threadId: "thread_mock_002_english", label: "Payment Delay Dispute" };
    }
    return null;
  };

  const filteredOrders = purchaseOrders.filter((po) => {
    return (
      po.po_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.lines.some((l) =>
        l.item_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by PO ID, vendor, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Showing {filteredOrders.length} purchase orders
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">PO Reference</th>
              <th className="py-3 px-4">Vendor ID</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-center">Lines</th>
              <th className="py-3 px-4 text-right">Committed Amount</th>
              <th className="py-3 px-4">Cross-Link Navigation</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono">
                  Loading purchase orders from ERP...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400 font-mono">
                  No purchase orders found matching query.
                </td>
              </tr>
            ) : (
              filteredOrders.map((po) => {
                const dispute = getDisputeLink(po.po_id);

                return (
                  <tr key={po.po_id} className="hover:bg-zinc-800/40 transition-colors group">
                    {/* PO ID */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-zinc-100">{po.po_id}</span>
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

                    {/* Vendor ID */}
                    <td className="py-3 px-4 font-mono">
                      <button
                        onClick={() => onSelectVendor(po.vendor_id)}
                        className="text-zinc-300 hover:text-white font-medium hover:underline"
                        title={`Filter Vendors by ${po.vendor_id}`}
                      >
                        {po.vendor_id}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-[11px] font-mono text-zinc-400">
                      {po.created_date}
                    </td>

                    {/* Lines Count */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[11px]">
                        {po.lines.length} {po.lines.length === 1 ? "line" : "lines"}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                      {formatCurrency(po.total_amount, po.currency)}
                    </td>

                    {/* Cross-Link Buttons */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onFindInvoices(po.po_id)}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 transition-colors"
                        >
                          Find Invoices
                        </button>
                        <button
                          onClick={() => onFindGRNs(po.po_id)}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-colors"
                        >
                          Find GRNs
                        </button>
                      </div>
                    </td>

                    {/* Inspect */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onInspectLines(po)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-mono transition-colors"
                      >
                        View Items
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
