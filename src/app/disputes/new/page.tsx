"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Send,
  Loader2,
  FileText,
  Building2,
  AlertCircle,
  HelpCircle,
  Hash,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { DialectBadge } from "@/components/shared/dialect-badge";
import { useToast } from "@/components/layout/toast-stack";
import { createDispute } from "@/lib/api/endpoints";
import { SAMPLE_DISPUTES, detectDialect } from "@/components/disputes/sample-disputes";

export default function NewDisputePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [message, setMessage] = useState<string>("");
  const [sender, setSender] = useState<string>("billing@acmesupply.co.in");
  const [customThreadId, setCustomThreadId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  const detectedLanguage = useMemo(() => detectDialect(message), [message]);
  const charCount = message.length;
  const maxChars = 10000;
  const isNearLimit = charCount > 9000;
  const isOverLimit = charCount > maxChars;

  const handleApplySample = (sampleId: string) => {
    const sample = SAMPLE_DISPUTES.find((s) => s.id === sampleId);
    if (!sample) return;
    setMessage(sample.message);
    setSender(sample.sender);
    setActiveSampleId(sample.id);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage("Please enter a dispute message before submitting.");
      return;
    }
    if (isOverLimit) {
      setErrorMessage(`Dispute message exceeds the ${maxChars} character limit.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        message: message.trim(),
        sender: sender.trim() || undefined,
        thread_id: customThreadId.trim() || undefined,
      };

      const result = await createDispute(payload);
      showToast(
        "Dispute Initialized",
        `Pipeline triggered for thread ${result.thread_id}`,
        "success"
      );
      router.push(`/disputes/${encodeURIComponent(result.thread_id)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit dispute";
      setErrorMessage(msg);
      showToast("Submission Failed", msg, "critical");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Dispute Submission Console
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-blue-950/60 text-blue-400 border border-blue-800/50">
              v2.4 Production
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Submit multi-dialect vendor claims across Hinglish, Devanagari Hindi, or English.
            The 8-node pipeline automates entity resolution, 3-way ERP match, and policy enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zod Runtime Guarded</span>
        </div>
      </div>

      {/* Quick-fill Sample Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Quick-Fill Production Test Scenarios:
          </span>
          <span className="text-zinc-500 text-[11px]">Click to auto-populate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_DISPUTES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleApplySample(sample.id)}
                className={`text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between group ${
                  isSelected
                    ? "bg-blue-950/40 border-blue-500/60 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]"
                    : "bg-[#18181B]/80 hover:bg-zinc-800/60 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-zinc-200 group-hover:text-blue-300 transition-colors">
                      {sample.label}
                    </span>
                    <DialectBadge language={sample.expectedDialect} className="text-[10px] py-0 px-1.5" />
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {sample.description}
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300">
                  {sample.sender}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassPanel className="p-6 space-y-5">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  Vendor Sender Email / Identifier
                </span>
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. ap@vendorcorp.com"
                className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-zinc-400" />
                  Custom Thread ID (Optional)
                </span>
              </label>
              <input
                type="text"
                value={customThreadId}
                onChange={(e) => setCustomThreadId(e.target.value)}
                placeholder="Leave blank for auto-generated thread_..."
                className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Textarea Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Vendor Raw Dispute Claim
                </span>
              </label>

              {/* Automatic Dialect Detection Pill */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">
                  Detected Dialect:
                </span>
                <DialectBadge language={detectedLanguage} />
              </div>
            </div>

            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (activeSampleId) setActiveSampleId(null);
                }}
                rows={7}
                placeholder="Paste incoming email, WhatsApp dispatch, or EDI message containing invoice or PO references (e.g. 'Bhai INV-20240103 ka payment abhi tak nahi aaya...')"
                className={`w-full bg-zinc-900/70 border rounded-xl p-4 text-zinc-100 placeholder:text-zinc-600 text-sm font-sans leading-relaxed resize-y focus:outline-none focus:ring-1 transition-all ${
                  isOverLimit
                    ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/40"
                    : "border-zinc-700/50 focus:border-blue-500 focus:ring-blue-500/40"
                }`}
              />

              {/* Real-time Inline Character Counter */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono backdrop-blur-sm">
                <span
                  className={
                    isOverLimit
                      ? "text-red-400 font-bold"
                      : isNearLimit
                      ? "text-orange-400"
                      : "text-zinc-400"
                  }
                >
                  {charCount.toLocaleString()}
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-500">{maxChars.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entity provenance parsing will scan for INV-*, PO-*, GRN-*, and VND-*</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setActiveSampleId(null);
                  setErrorMessage(null);
                }}
                disabled={isSubmitting || !message}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim() || isOverLimit}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Triggering Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit to VendOps Pipeline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </GlassPanel>
      </form>

      {/* Architecture Hint Footnote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-500">
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
          <div className="text-zinc-300 font-medium mb-1">1. Dialect Preservation</div>
          <p className="leading-relaxed">
            Hinglish and Hindi input retain their original conversational context while token-fertility compressors normalize semantics.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
          <div className="text-zinc-300 font-medium mb-1">2. Anti-Hallucination Guard</div>
          <p className="leading-relaxed">
            All extracted invoice & PO identifiers are checked against the provenance registry before ERP tool calls.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
          <div className="text-zinc-300 font-medium mb-1">3. HITL Circuit Breaker</div>
          <p className="leading-relaxed">
            Claims exceeding $100,000 or low-confidence policy alignments pause at the hitl_gate node for human approval.
          </p>
        </div>
      </div>
    </div>
  );
}
