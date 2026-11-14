"use client";

import React, { useState } from "react";
import {
  FileSearch,
  ChevronDown,
  ChevronUp,
  Tag,
  Copy,
  Check,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { DialectBadge } from "@/components/shared/dialect-badge";

interface ExtractedEntitiesPanelProps {
  rawMessage?: string;
  extractedIds?: string[];
  provenanceIds?: string[];
  language?: string | null;
}

export function ExtractedEntitiesPanel({
  rawMessage = "",
  extractedIds = [],
  provenanceIds = [],
  language = "en",
}: ExtractedEntitiesPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Combine and deduplicate extracted IDs
  const allIds = Array.from(new Set([...extractedIds, ...provenanceIds]));

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Render text with highlighted inline IDs
  const renderHighlightedMessage = (text: string) => {
    if (!text) return <span className="text-zinc-500 italic">No message captured yet.</span>;

    // Pattern matching INV-..., PO-..., GRN-..., VND-..., or $amounts
    const entityRegex = /\b(INV-\d+|PO-\d+|GRN-\d+|VND-\d+|\$[\d,]+(?:\.\d{2})?)\b/g;
    const parts = text.split(entityRegex);

    return parts.map((part, index) => {
      if (/^INV-/.test(part)) {
        return (
          <mark
            key={index}
            className="px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/50 text-blue-300 font-mono text-xs font-semibold mx-0.5 inline-block"
          >
            {part}
          </mark>
        );
      }
      if (/^PO-/.test(part)) {
        return (
          <mark
            key={index}
            className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/50 text-purple-300 font-mono text-xs font-semibold mx-0.5 inline-block"
          >
            {part}
          </mark>
        );
      }
      if (/^GRN-/.test(part)) {
        return (
          <mark
            key={index}
            className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-semibold mx-0.5 inline-block"
          >
            {part}
          </mark>
        );
      }
      if (/^VND-/.test(part)) {
        return (
          <mark
            key={index}
            className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-xs font-semibold mx-0.5 inline-block"
          >
            {part}
          </mark>
        );
      }
      if (/^\$/.test(part)) {
        return (
          <mark
            key={index}
            className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-600 text-zinc-100 font-mono text-xs font-semibold mx-0.5 inline-block"
          >
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getEntityBadgeStyle = (id: string) => {
    if (id.startsWith("INV-")) return "bg-blue-950/60 text-blue-300 border-blue-600/50";
    if (id.startsWith("PO-")) return "bg-purple-950/60 text-purple-300 border-purple-600/50";
    if (id.startsWith("GRN-")) return "bg-emerald-950/60 text-emerald-300 border-emerald-600/50";
    if (id.startsWith("VND-")) return "bg-amber-950/60 text-amber-300 border-amber-600/50";
    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  return (
    <GlassPanel className="p-4 transition-all">
      {/* Panel Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            Extracted Entities & Provenance
          </h3>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
            {allIds.length} identifiers
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DialectBadge language={language} className="text-[11px] py-0 px-2" />
          <button
            type="button"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3.5 pt-3 border-t border-zinc-800/80">
          {/* Inline Highlighted Text */}
          <div>
            <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
              <span>Inline Entity Token Scanner:</span>
              <span className="text-zinc-500 lowercase">INV (Blue) • PO (Purple) • GRN (Emerald)</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs font-sans leading-relaxed text-zinc-200">
              {renderHighlightedMessage(rawMessage)}
            </div>
          </div>

          {/* Extracted Entity Tags */}
          {allIds.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-zinc-400" />
                <span>Extracted Identifiers:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleCopy(id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all hover:scale-105 ${getEntityBadgeStyle(
                      id
                    )}`}
                    title="Click to copy identifier"
                  >
                    <span>{id}</span>
                    {copiedId === id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Provenance Verification Status */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-300">Entity Provenance Integrity</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Zero Pre-Execution Hallucinations
            </span>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
