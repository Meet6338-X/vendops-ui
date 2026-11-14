"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { DialectBadge } from "@/components/shared/dialect-badge";

interface GroundedReplyCardProps {
  response?: string | null;
  streamingTokens?: string;
  language?: string | null;
  executionSuccess?: boolean;
}

export function GroundedReplyCard({
  response,
  streamingTokens = "",
  language = "en",
  executionSuccess,
}: GroundedReplyCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const displayReply = response || streamingTokens;

  const handleCopy = () => {
    if (!displayReply) return;
    navigator.clipboard.writeText(displayReply);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  if (!displayReply) {
    return (
      <GlassPanel className="p-4 opacity-75">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-400">Final Grounded Vendor Reply</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Awaiting respond node...</span>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-4 transition-all" variant="glow" glowColor="blue">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            Final Grounded Vendor Reply
          </h3>
          <DialectBadge language={language} className="text-[10px] py-0 px-2" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3 pt-3 border-t border-zinc-800/80">
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-blue-500/20 text-sm font-sans leading-relaxed text-zinc-100 whitespace-pre-wrap">
            {displayReply}
            {!response && streamingTokens && (
              <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Synthesized directly in vendor&apos;s native dialect & vernacular style
            </span>
            {executionSuccess != null && (
              <span className="text-emerald-400">
                ERP Execution: {executionSuccess ? "Confirmed" : "Pending Signoff"}
              </span>
            )}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
