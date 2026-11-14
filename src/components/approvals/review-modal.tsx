"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeDispute } from "@/lib/api/endpoints";
import {
  ActionType,
  ActionTypeSchema,
  ApprovalQueueItem,
  ResolutionReview,
} from "@/lib/schemas/dispute";
import { formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@/components/layout/toast-stack";
import { ActionBadge } from "./action-badge";
import {
  X,
  ShieldCheck,
  XCircle,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  UserCheck,
  MessageSquare,
  DollarSign,
} from "lucide-react";

export type ReviewIntent = "APPROVE" | "REJECT" | "MODIFY";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalItem: ApprovalQueueItem;
  initialIntent?: ReviewIntent;
}

const ACTION_TYPES: ActionType[] = [
  "CREDIT_NOTE",
  "REPLACEMENT",
  "PARTIAL_PAYMENT",
  "RELEASE_PAYMENT",
  "REJECT",
  "ESCALATE",
];

const PRESET_REVIEWERS = ["REV-DIR-402", "REV-FIN-104", "REV-AP-088"];

export function ReviewModal({
  isOpen,
  onClose,
  approvalItem,
  initialIntent = "APPROVE",
}: ReviewModalProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const proposedAction = (approvalItem.proposal?.action ||
    approvalItem.interrupt.action ||
    "RELEASE_PAYMENT") as ActionType;

  const proposedAmount =
    approvalItem.proposal?.amount ?? approvalItem.interrupt.amount ?? 0;

  const [intent, setIntent] = useState<ReviewIntent>(initialIntent);
  const [reviewerId, setReviewerId] = useState<string>("REV-DIR-402");
  const [comments, setComments] = useState<string>("");
  const [overrideAction, setOverrideAction] = useState<ActionType>(proposedAction);
  const [overrideAmount, setOverrideAmount] = useState<number>(proposedAmount);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state whenever modal opens or initial intent changes
  useEffect(() => {
    if (isOpen) {
      setIntent(initialIntent);
      setComments("");
      setOverrideAction(initialIntent === "REJECT" ? "REJECT" : proposedAction);
      setOverrideAmount(initialIntent === "REJECT" ? 0 : proposedAmount);
      setValidationError(null);
    }
  }, [isOpen, initialIntent, proposedAction, proposedAmount]);

  const mutation = useMutation({
    mutationFn: async (payload: ResolutionReview) => {
      return resumeDispute(approvalItem.thread_id, payload);
    },
    onSuccess: (res, variables) => {
      // Invalidate queries to refresh pending approvals and audit ledger
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["audit-log"] });

      const actionLabel =
        variables.override_action ||
        (variables.approved ? proposedAction : "REJECT");

      const amountLabel =
        variables.override_amount !== undefined && variables.override_amount !== null
          ? formatCurrency(variables.override_amount)
          : formatCurrency(proposedAmount);

      showToast(
        variables.approved ? "Resolution Approved & Executed" : "Dispute Claim Rejected",
        `Thread ${approvalItem.thread_id} committed (${actionLabel} · ${amountLabel}) by ${variables.reviewer_id}.`,
        "success"
      );

      onClose();
    },
    onError: (err: any) => {
      showToast(
        "Action Failed",
        err.message || "Failed to commit resolution to backend.",
        "critical"
      );
    },
  });

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !mutation.isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, mutation.isPending]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerId.trim()) {
      setValidationError("Reviewer ID is required for compliance and audit trail.");
      return;
    }

    if (comments.length > 1000) {
      setValidationError("Comments must not exceed 1000 characters.");
      return;
    }

    if (intent === "MODIFY") {
      if (isNaN(overrideAmount) || overrideAmount < 0) {
        setValidationError("Authorized override amount must be a positive number.");
        return;
      }
    }

    setValidationError(null);

    const isApproved = intent !== "REJECT";
    const payload: ResolutionReview = {
      approved: isApproved,
      reviewer_id: reviewerId.trim(),
      comments: comments.trim(),
      override_action: intent === "MODIFY" ? overrideAction : intent === "REJECT" ? "REJECT" : null,
      override_amount: intent === "MODIFY" ? overrideAmount : intent === "REJECT" ? 0 : null,
    };

    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!mutation.isPending) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#18181B] border border-zinc-700/60 shadow-2xl z-10 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "p-2 rounded-xl border",
                intent === "APPROVE" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
                intent === "MODIFY" && "bg-amber-500/10 border-amber-500/30 text-amber-400",
                intent === "REJECT" && "bg-red-500/10 border-red-500/30 text-red-400"
              )}
            >
              {intent === "APPROVE" && <ShieldCheck className="w-5 h-5" />}
              {intent === "MODIFY" && <Sliders className="w-5 h-5" />}
              {intent === "REJECT" && <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                {intent === "APPROVE" && "Approve Resolution Proposal"}
                {intent === "MODIFY" && "Modify Terms & Authorize"}
                {intent === "REJECT" && "Reject Dispute Claim"}
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Thread: {approvalItem.thread_id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intent Selector Tabs */}
        <div className="grid grid-cols-3 p-2 bg-zinc-950/60 border-b border-zinc-800/80 gap-1.5">
          <button
            type="button"
            onClick={() => setIntent("APPROVE")}
            disabled={mutation.isPending}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all",
              intent === "APPROVE"
                ? "bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>

          <button
            type="button"
            onClick={() => setIntent("MODIFY")}
            disabled={mutation.isPending}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all",
              intent === "MODIFY"
                ? "bg-amber-950/50 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            )}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Modify Terms</span>
          </button>

          <button
            type="button"
            onClick={() => setIntent("REJECT")}
            disabled={mutation.isPending}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all",
              intent === "REJECT"
                ? "bg-red-950/50 text-red-300 border border-red-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            )}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Summary Banner */}
          <div className="rounded-xl bg-zinc-950/50 border border-zinc-800/80 p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">
                Autonomous Proposal
              </span>
              <div className="flex items-center gap-2 mt-1">
                <ActionBadge action={proposedAction} size="sm" />
                <span className="font-mono font-bold text-white">
                  {formatCurrency(proposedAmount)}
                </span>
              </div>
            </div>
            {approvalItem.interrupt.reason && (
              <div className="text-right max-w-[220px]">
                <span className="text-zinc-500 block uppercase font-mono text-[10px]">
                  Interrupt Reason
                </span>
                <span className="text-amber-400 font-mono text-[11px] truncate block">
                  {approvalItem.interrupt.reason}
                </span>
              </div>
            )}
          </div>

          {/* Reviewer ID (Required) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Reviewer Staff ID</span>
                <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-zinc-500 mr-1">Presets:</span>
                {PRESET_REVIEWERS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setReviewerId(preset)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              required
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              placeholder="e.g. REV-DIR-402"
              disabled={mutation.isPending}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600 disabled:opacity-50"
            />
            <p className="text-[11px] text-zinc-500">
              Mandatory staff credential logged to the immutable audit ledger.
            </p>
          </div>

          {/* Modification Fields: only shown if intent === "MODIFY" */}
          {intent === "MODIFY" && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                <Sliders className="w-3.5 h-3.5" />
                <span>Override Proposal Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Override ActionType Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Action Type Override
                  </label>
                  <select
                    value={overrideAction}
                    onChange={(e) => setOverrideAction(e.target.value as ActionType)}
                    disabled={mutation.isPending}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all disabled:opacity-50"
                  >
                    {ACTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Override Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Authorized Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={overrideAmount}
                    onChange={(e) => setOverrideAmount(parseFloat(e.target.value) || 0)}
                    disabled={mutation.isPending}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Audit Comments (Optional, max 1000 chars) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>Audit & Justification Comments</span>
              </label>
              <span
                className={cn(
                  "text-[10px] font-mono",
                  comments.length > 900 ? "text-amber-400" : "text-zinc-500"
                )}
              >
                {comments.length} / 1000
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={1000}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Explain rationale for this decision, policy exceptions, or warehouse intake conditions..."
              disabled={mutation.isPending}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600 resize-none disabled:opacity-50 leading-relaxed"
            />
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed",
                intent === "APPROVE" && "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30",
                intent === "MODIFY" && "bg-amber-600 hover:bg-amber-500 shadow-amber-900/30",
                intent === "REJECT" && "bg-red-600 hover:bg-red-500 shadow-red-900/30"
              )}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Committing to ERP...</span>
                </>
              ) : (
                <>
                  {intent === "APPROVE" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {intent === "MODIFY" && <Sliders className="w-3.5 h-3.5" />}
                  {intent === "REJECT" && <XCircle className="w-3.5 h-3.5" />}
                  <span>
                    {intent === "APPROVE" && `Confirm & Release (${formatCurrency(proposedAmount)})`}
                    {intent === "MODIFY" && `Commit Override (${formatCurrency(overrideAmount)})`}
                    {intent === "REJECT" && "Confirm Rejection"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
