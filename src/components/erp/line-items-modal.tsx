"use client";

import React from "react";
import { X, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Invoice, PurchaseOrder, GoodsReceiptNote } from "@/lib/schemas/erp";

export type InvoiceLine = Invoice["lines"][number];
export type POLine = PurchaseOrder["lines"][number];
export type GRNLine = GoodsReceiptNote["lines"][number];

type ModalData =
  | { type: "INVOICE"; title: string; subtitle: string; lines: InvoiceLine[]; totalAmount?: number; currency?: string }
  | { type: "PO"; title: string; subtitle: string; lines: POLine[]; totalAmount?: number; currency?: string }
  | { type: "GRN"; title: string; subtitle: string; lines: GRNLine[] };

interface LineItemsModalProps {
  data: ModalData | null;
  onClose: () => void;
}

export function LineItemsModal({ data, onClose }: LineItemsModalProps) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-[#18181B] border border-zinc-700/60 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {data.type} LINE ITEMS
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">{data.title}</h3>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{data.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {data.type === "INVOICE" && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px] pb-2">
                  <th className="pb-2">Line</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Billed Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {data.lines.map((l) => (
                  <tr key={l.line_number} className="hover:bg-zinc-800/30">
                    <td className="py-2.5 font-mono text-zinc-400">#{l.line_number}</td>
                    <td className="py-2.5 font-mono text-blue-400 font-medium">{l.item_sku}</td>
                    <td className="py-2.5 text-zinc-200">{l.description}</td>
                    <td className="py-2.5 text-right font-mono text-zinc-200">{l.billed_qty}</td>
                    <td className="py-2.5 text-right font-mono text-zinc-400">
                      {formatCurrency(l.unit_price, data.currency)}
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-white">
                      {formatCurrency(l.total_price, data.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {data.type === "PO" && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px] pb-2">
                  <th className="pb-2">Line</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Ordered Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {data.lines.map((l) => (
                  <tr key={l.line_number} className="hover:bg-zinc-800/30">
                    <td className="py-2.5 font-mono text-zinc-400">#{l.line_number}</td>
                    <td className="py-2.5 font-mono text-blue-400 font-medium">{l.item_sku}</td>
                    <td className="py-2.5 text-zinc-200">{l.description}</td>
                    <td className="py-2.5 text-right font-mono text-zinc-200">{l.ordered_qty}</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-white">
                      {formatCurrency(l.unit_price, l.currency || data.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {data.type === "GRN" && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px] pb-2">
                  <th className="pb-2">Line</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2 text-right">Received</th>
                  <th className="pb-2 text-right">Accepted</th>
                  <th className="pb-2 text-right">Rejected</th>
                  <th className="pb-2">Rejection Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {data.lines.map((l) => (
                  <tr key={l.line_number} className="hover:bg-zinc-800/30">
                    <td className="py-2.5 font-mono text-zinc-400">#{l.line_number}</td>
                    <td className="py-2.5 font-mono text-blue-400 font-medium">{l.item_sku}</td>
                    <td className="py-2.5 text-right font-mono text-zinc-200">{l.received_qty}</td>
                    <td className="py-2.5 text-right font-mono text-emerald-400 font-medium">
                      {l.accepted_qty}
                    </td>
                    <td className="py-2.5 text-right font-mono text-red-400 font-medium">
                      {l.rejected_qty}
                    </td>
                    <td className="py-2.5 text-zinc-400">
                      {l.rejected_qty > 0 ? (
                        <span className="text-red-300 font-mono text-[11px]">
                          {l.rejection_reason || "Damaged on dock"}
                        </span>
                      ) : (
                        <span className="text-emerald-500 text-[11px]">Clean receipt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="text-xs font-mono text-zinc-400">
            Total lines: {data.lines.length}
          </div>
          {"totalAmount" in data && data.totalAmount !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 uppercase font-mono">Gross Total:</span>
              <span className="text-base font-bold font-mono text-white">
                {formatCurrency(data.totalAmount, data.currency)}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
