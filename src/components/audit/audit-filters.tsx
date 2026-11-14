"use client";

import React from "react";
import { ActionType } from "@/lib/schemas/dispute";
import { Search, Filter, X, RotateCcw } from "lucide-react";

export interface AuditFilterState {
  searchQuery: string;
  actionType: string; // "ALL" or ActionType
  reviewerType: string; // "ALL" | "AUTONOMOUS" | "STAFF"
}

interface AuditFiltersProps {
  filters: AuditFilterState;
  onChange: (filters: AuditFilterState) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

const ACTION_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All Actions" },
  { value: "RELEASE_PAYMENT", label: "Release Payment" },
  { value: "PARTIAL_PAYMENT", label: "Partial Payment" },
  { value: "CREDIT_NOTE", label: "Credit Note" },
  { value: "REPLACEMENT", label: "Replacement" },
  { value: "REJECT", label: "Reject Claim" },
  { value: "ESCALATE", label: "Escalate" },
];

export function AuditFilters({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}: AuditFiltersProps) {
  const isFiltered =
    filters.searchQuery.trim() !== "" ||
    filters.actionType !== "ALL" ||
    filters.reviewerType !== "ALL";

  return (
    <div className="rounded-2xl bg-[#18181B]/80 backdrop-blur-md border border-zinc-700/40 p-4 space-y-3 shadow-lg">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input: searches Invoice ID, Reviewer ID, Audit ID, PO ID */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by Invoice ID (e.g. INV-20240101), Reviewer ID, Audit ID, or PO ID..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white font-mono text-xs placeholder:font-sans placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* ActionType Enum Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Action:</span>
            <select
              value={filters.actionType}
              onChange={(e) => onChange({ ...filters, actionType: e.target.value })}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reviewer ID Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Reviewer:</span>
            <select
              value={filters.reviewerType}
              onChange={(e) => onChange({ ...filters, reviewerType: e.target.value })}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Reviewers</option>
              <option value="AUTONOMOUS">SYS-AUTONOMOUS Only</option>
              <option value="STAFF">Human Staff (HITL) Only</option>
            </select>
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-zinc-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Counter bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Showing</span>
          <span className="text-white font-bold">{filteredCount}</span>
          <span className="text-zinc-500">of</span>
          <span className="text-white font-bold">{totalCount}</span>
          <span className="text-zinc-500">immutable audit records</span>
        </div>

        {isFiltered && (
          <span className="text-blue-400 text-[10px] font-semibold uppercase tracking-wider">
            Filtered View Active
          </span>
        )}
      </div>
    </div>
  );
}
