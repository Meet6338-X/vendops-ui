"use client";

export const dynamic = "force-dynamic";

import React, { useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  RefreshCw,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { getDispute } from "@/lib/api/endpoints";
import { useDisputeSSE } from "@/lib/sse/use-dispute-sse";
import { VendOpsState } from "@/lib/schemas/dispute";
import { GlassPanel } from "@/components/shared/glass-panel";
import { DialectBadge } from "@/components/shared/dialect-badge";
import { PipelineGraph, PIPELINE_NODES_CONFIG } from "@/components/disputes/pipeline-graph";
import { ExtractedEntitiesPanel } from "@/components/disputes/extracted-entities-panel";
import { TriageCard } from "@/components/disputes/triage-card";
import { CompressionStatsCard } from "@/components/disputes/compression-stats-card";
import { ThreeWayMatchTable } from "@/components/disputes/three-way-match-table";
import { SopCitationsCard } from "@/components/disputes/sop-citations-card";
import { ResolutionProposalCard } from "@/components/disputes/resolution-proposal-card";
import { GuardEventsCard } from "@/components/disputes/guard-events-card";
import { GroundedReplyCard } from "@/components/disputes/grounded-reply-card";
import { HitlAlertBanner } from "@/components/disputes/hitl-alert-banner";

export default function DisputeRunViewPage() {
  const params = useParams();
  const threadId = (params?.id as string) || "";
  const [copiedThreadId, setCopiedThreadId] = React.useState(false);

  // References for scrolling to panels
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 1. Initial State Query
  const {
    data: initialDispute,
    isLoading: isLoadingInitial,
    refetch,
  } = useQuery({
    queryKey: ["dispute", threadId],
    queryFn: () => getDispute(threadId),
    enabled: !!threadId,
  });

  // 2. Real-time SSE Stream Hook
  const {
    status: sseStatus,
    currentRunningNode,
    executedNodes: sseExecutedNodes,
    tokens: streamingTokens,
    pendingInterrupt,
    state: sseState,
    error: sseError,
    reconnect,
  } = useDisputeSSE(threadId);

  // 3. Merged Dispute State
  const mergedState: Partial<VendOpsState> = useMemo(() => {
    return {
      ...(initialDispute?.state || {}),
      ...(sseState || {}),
    };
  }, [initialDispute?.state, sseState]);

  // 4. Calculate Executed Nodes
  const effectiveExecutedNodes = useMemo(() => {
    if (sseExecutedNodes.length > 0) {
      return sseExecutedNodes;
    }
    // If not streaming SSE, deduce executed nodes from existing state
    const nodes: string[] = [];
    if (mergedState.raw_message) nodes.push("ingest");
    if (mergedState.normalized_message || mergedState.token_fertility) nodes.push("compress");
    if (mergedState.triage) nodes.push("triage");
    if (mergedState.match_result) nodes.push("verify");
    if (mergedState.proposal || (mergedState.retrieved_policies && mergedState.retrieved_policies.length > 0)) {
      nodes.push("decide");
    }
    if (mergedState.hitl_required || initialDispute?.is_interrupted) {
      nodes.push("hitl_gate");
    }
    if (mergedState.execution_result) nodes.push("execute");
    if (mergedState.response) nodes.push("respond");

    // If dispute is RESOLVED or COMPLETED, ensure all completed
    if (
      initialDispute?.status === "RESOLVED" ||
      initialDispute?.status === "COMPLETED" ||
      sseStatus === "completed"
    ) {
      return PIPELINE_NODES_CONFIG.map((n) => n.key);
    }

    return nodes;
  }, [sseExecutedNodes, mergedState, initialDispute?.status, initialDispute?.is_interrupted, sseStatus]);

  // Overall Interrupted Status
  const isInterrupted =
    sseStatus === "paused_interrupt" ||
    initialDispute?.is_interrupted ||
    initialDispute?.status === "WAITING_APPROVAL";

  // Effective Stream/Pipeline Status
  const effectiveStatus = useMemo(() => {
    if (isInterrupted) return "paused_interrupt";
    if (sseStatus !== "idle") return sseStatus;
    if (initialDispute?.status === "RESOLVED" || initialDispute?.status === "COMPLETED")
      return "completed";
    return "idle";
  }, [isInterrupted, sseStatus, initialDispute?.status]);

  const handleCopyThreadId = () => {
    navigator.clipboard.writeText(threadId);
    setCopiedThreadId(true);
    setTimeout(() => setCopiedThreadId(false), 1500);
  };

  const handleSelectNode = (nodeKey: string) => {
    const el = panelRefs.current[nodeKey];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Metadata Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/disputes/new"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Submit another dispute"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Run View
              </span>
              <span className="text-zinc-600">•</span>
              <button
                type="button"
                onClick={handleCopyThreadId}
                className="flex items-center gap-1.5 font-mono text-sm font-semibold text-zinc-100 hover:text-blue-400 transition-colors"
              >
                <span>{threadId}</span>
                {copiedThreadId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live sequential LangGraph execution stream with runtime Zod guard enforcement.
            </p>
          </div>
        </div>

        {/* Action Controls & Stream Indicator */}
        <div className="flex items-center gap-2">
          <DialectBadge language={mergedState.language_detected} />

          <button
            type="button"
            onClick={() => {
              refetch();
              reconnect();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Stream</span>
          </button>
        </div>
      </div>

      {/* HITL Circuit Breaker Alert Banner (if paused_interrupt) */}
      {isInterrupted && (
        <HitlAlertBanner
          threadId={threadId}
          reason={
            pendingInterrupt?.reason ||
            (initialDispute?.pending_interrupt as any)?.reason ||
            "Transaction value or policy discrepancy requires human-in-the-loop review."
          }
          amount={
            pendingInterrupt?.amount ||
            (initialDispute?.pending_interrupt as any)?.amount ||
            mergedState.proposal?.amount
          }
        />
      )}

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive React Flow Graph (5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
              <span className="font-semibold uppercase tracking-wider text-zinc-300">
                Pipeline Execution Graph
              </span>
              <span className="font-mono text-[11px] text-zinc-500">Click node to inspect</span>
            </div>

            <PipelineGraph
              currentRunningNode={currentRunningNode}
              executedNodes={effectiveExecutedNodes}
              streamStatus={effectiveStatus}
              isInterrupted={isInterrupted}
              onSelectNode={handleSelectNode}
            />
          </div>
        </div>

        {/* Right Column: Streaming Inspection Panels (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Node 1: Ingest & Entities */}
          <div ref={(el) => { panelRefs.current["ingest"] = el; }}>
            <ExtractedEntitiesPanel
              rawMessage={mergedState.raw_message}
              extractedIds={mergedState.triage?.extracted_ids}
              provenanceIds={mergedState.provenance_ids}
              language={mergedState.language_detected}
            />
          </div>

          {/* Node 2: Context Compression & Token Fertility */}
          <div ref={(el) => { panelRefs.current["compress"] = el; }}>
            <CompressionStatsCard
              rawMessage={mergedState.raw_message}
              normalizedMessage={mergedState.normalized_message}
              tokenFertility={mergedState.token_fertility}
            />
          </div>

          {/* Node 3: Triage & Classification */}
          <div ref={(el) => { panelRefs.current["triage"] = el; }}>
            <TriageCard triage={mergedState.triage} />
          </div>

          {/* Node 4: 3-Way Match Reconciliation */}
          <div ref={(el) => { panelRefs.current["verify"] = el; }}>
            <ThreeWayMatchTable matchResult={mergedState.match_result} />
          </div>

          {/* Node 5: SOP Policy Citations */}
          <div ref={(el) => { panelRefs.current["decide"] = el; }}>
            <SopCitationsCard policies={mergedState.retrieved_policies} />
          </div>

          {/* Node 6: Synthesized Resolution Proposal */}
          <div ref={(el) => { panelRefs.current["hitl_gate"] = el; }}>
            <ResolutionProposalCard proposal={mergedState.proposal} />
          </div>

          {/* Node 7: Guard Events & Interventions */}
          <div ref={(el) => { panelRefs.current["execute"] = el; }}>
            <GuardEventsCard
              toolCallErrors={mergedState.tool_call_errors}
              repairAttempts={mergedState.repair_attempts}
            />
          </div>

          {/* Node 8: Final Grounded Reply */}
          <div ref={(el) => { panelRefs.current["respond"] = el; }}>
            <GroundedReplyCard
              response={mergedState.response}
              streamingTokens={streamingTokens}
              language={mergedState.language_detected}
              executionSuccess={mergedState.execution_result?.success}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
