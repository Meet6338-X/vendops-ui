"use client";

import React from "react";
import { Search, Building2, CheckCircle2, FileText, ShoppingBag } from "lucide-react";
import { Vendor } from "@/lib/schemas/erp";

interface VendorsTableProps {
  vendors: Vendor[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewInvoices: (vendorId: string) => void;
  onViewPOs: (vendorId: string) => void;
}

export function VendorsTable({
  vendors,
  isLoading,
  searchQuery,
  onSearchChange,
  onViewInvoices,
  onViewPOs,
}: VendorsTableProps) {
  const filteredVendors = vendors.filter((v) => {
    return (
      v.vendor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Filter by vendor ID or company name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Showing {filteredVendors.length} registered vendors
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">Vendor ID</th>
              <th className="py-3 px-4">Company Name</th>
              <th className="py-3 px-4">Standard Payment Terms</th>
              <th className="py-3 px-4">Billing Currency</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Quick Navigation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500 font-mono">
                  Loading vendors from ERP...
                </td>
              </tr>
            ) : filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400 font-mono">
                  No vendors found matching query.
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr key={vendor.vendor_id} className="hover:bg-zinc-800/40 transition-colors group">
                  {/* Vendor ID */}
                  <td className="py-3 px-4 font-mono">
                    <span className="font-semibold text-zinc-100">{vendor.vendor_id}</span>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-zinc-800 text-blue-400">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{vendor.name}</span>
                    </div>
                  </td>

                  {/* Payment Terms */}
                  <td className="py-3 px-4 font-mono text-zinc-300">
                    Net {vendor.payment_terms_days} Days
                  </td>

                  {/* Currency */}
                  <td className="py-3 px-4 font-mono text-zinc-400">
                    {vendor.currency || "USD"}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{vendor.status || "ACTIVE"}</span>
                    </span>
                  </td>

                  {/* Quick Links */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewInvoices(vendor.vendor_id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-mono transition-colors"
                      >
                        <FileText className="w-3 h-3 text-blue-400" />
                        <span>Invoices</span>
                      </button>
                      <button
                        onClick={() => onViewPOs(vendor.vendor_id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-mono transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3 text-emerald-400" />
                        <span>POs</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
