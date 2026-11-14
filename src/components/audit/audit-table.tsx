"use client";

import React, { useState, useMemo } from "react";
import { AuditEntry } from "@/lib/schemas/erp";
import { formatCurrency, formatKolkataTime, formatRelativeTime, cn } from "@/lib/utils";
import { ActionBadge } from "../approvals/action-badge";
import { AuditDetailModal } from "./audit-detail-modal";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Bot,
  UserCheck,
  Eye,
  FileSpreadsheet,
} from "lucide-react";

interface AuditTableProps {
  entries: AuditEntry[];
}

type SortField = "timestamp" | "amount" | "audit_id";
type SortDirection = "asc" | "desc";

export function AuditTable({ entries }: AuditTableProps) {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  const sortedEntries = useMemo(() => {
    const list = [...entries];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === "timestamp") {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        comparison = timeA - timeB;
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortField === "audit_id") {
        comparison = a.audit_id.localeCompare(b.audit_id);
      }
      return sortDir === "asc" ? comparison : -comparison;
    });
    return list;
  }, [entries, sortField, sortDir]);

  const totalPages = Math.ceil(sortedEntries.length / pageSize) || 1;
  const pagedEntries = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedEntries.slice(start, start + pageSize);
  }, [sortedEntries, page, pageSize]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-zinc-600" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-400" />
    );
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl bg-[#18181B]/80 backdrop-blur-md border border-zinc-700/40 p-12 text-center space-y-3">
        <FileSpreadsheet className="w-8 h-8 text-zinc-500 mx-auto" />
        <h4 className="text-sm font-semibold text-white">No Audit Records Found</h4>
        <p className="text-xs text-zinc-400">
          No records match your active search filters or query criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#18181B]/90 backdrop-blur-md border border-zinc-700/40 overflow-hidden shadow-2xl flex flex-col">
      {/* Scrollable Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300 border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 font-mono text-[11px] text-zinc-400 select-none">
              {/* 1. Timestamp */}
              <th
                onClick={() => handleSort("timestamp")}
                className="py-3 px-4 font-semibold hover:text-white cursor-pointer transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Timestamp (Asia/Kolkata)</span>
                  {renderSortIndicator("timestamp")}
                </div>
              </th>

              {/* 2. Audit ID */}
              <th
                onClick={() => handleSort("audit_id")}
                className="py-3 px-3 font-semibold hover:text-white cursor-pointer transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Audit ID</span>
                  {renderSortIndicator("audit_id")}
                </div>
              </th>

              {/* 3. Invoice ID */}
              <th className="py-3 px-3 font-semibold whitespace-nowrap">Invoice ID</th>

              {/* 4. PO ID */}
              <th className="py-3 px-3 font-semibold whitespace-nowrap">PO ID</th>

              {/* 5. Vendor ID */}
              <th className="py-3 px-3 font-semibold whitespace-nowrap">Vendor ID</th>

              {/* 6. ActionType badge */}
              <th className="py-3 px-3 font-semibold whitespace-nowrap">Action Type</th>

              {/* 7. Authorized Amount */}
              <th
                onClick={() => handleSort("amount")}
                className="py-3 px-3 font-semibold hover:text-white cursor-pointer transition-colors whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Authorized Amount</span>
                  {renderSortIndicator("amount")}
                </div>
              </th>

              {/* 8. Idempotency Key */}
              <th className="py-3 px-3 font-semibold whitespace-nowrap">Idempotency Key</th>

              {/* 9. Reviewer ID */}
              <th className="py-3 px-3 font-semibold whitespace-nowrap">Reviewer Authority</th>

              {/* 10. Rationale */}
              <th className="py-3 px-4 font-semibold whitespace-nowrap">Rationale</th>

              {/* Action column */}
              <th className="py-3 px-3 text-center whitespace-nowrap">Inspect</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {pagedEntries.map((row) => {
              const isAutonomous = !row.reviewer_id || row.reviewer_id === "SYS-AUTONOMOUS";
              const truncatedKey =
                row.idempotency_key.length > 14
                  ? `${row.idempotency_key.slice(0, 10)}...${row.idempotency_key.slice(-4)}`
                  : row.idempotency_key;

              return (
                <tr
                  key={row.audit_id}
                  onClick={() => setSelectedEntry(row)}
                  className="hover:bg-zinc-800/40 cursor-pointer transition-colors group"
                >
                  {/* 1. Timestamp */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono text-xs text-white">
                      {formatKolkataTime(row.timestamp)}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {formatRelativeTime(row.timestamp)}
                    </div>
                  </td>

                  {/* 2. Audit ID */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-blue-400">
                        {row.audit_id}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(row.audit_id, row.audit_id, e)}
                        className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        title="Copy Audit ID"
                      >
                        {copiedId === row.audit_id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* 3. Invoice ID */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-xs text-zinc-200">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {row.invoice_id}
                    </span>
                  </td>

                  {/* 4. PO ID */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-xs text-zinc-400">
                    {row.po_id || "—"}
                  </td>

                  {/* 5. Vendor ID */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-xs text-zinc-400">
                    {row.vendor_id}
                  </td>

                  {/* 6. ActionType badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <ActionBadge action={row.action} size="sm" />
                  </td>

                  {/* 7. Authorized Amount (bold JetBrains Mono) */}
                  <td className="py-3 px-3 whitespace-nowrap text-right font-mono font-bold text-xs text-white">
                    {formatCurrency(row.amount)}
                  </td>

                  {/* 8. Idempotency Key */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-mono text-[11px] text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800"
                        title={row.idempotency_key}
                      >
                        {truncatedKey}
                      </span>
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopy(row.idempotency_key, `${row.audit_id}_key`, e)
                        }
                        className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        title="Copy Idempotency Key"
                      >
                        {copiedId === `${row.audit_id}_key` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* 9. Reviewer ID */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      {isAutonomous ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/40 text-purple-300 border border-purple-500/30">
                          <Bot className="w-3 h-3 text-purple-400" />
                          <span>SYS-AUTONOMOUS</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950/40 text-blue-300 border border-blue-500/30">
                          <UserCheck className="w-3 h-3 text-blue-400" />
                          <span>{row.reviewer_id}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 10. Rationale */}
                  <td className="py-3 px-4 max-w-xs truncate text-xs text-zinc-400 font-sans">
                    {row.rationale}
                  </td>

                  {/* Inspect Button */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntry(row);
                      }}
                      className="p-1 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                      title="Inspect Full Record"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-white font-mono text-xs focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-zinc-500 font-mono text-[11px] ml-2">
            Page {page} of {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Record Inspection Modal */}
      <AuditDetailModal
        isOpen={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
      />
    </div>
  );
}
