import { z } from "zod";

export const ActionTypeSchema = z.enum([
  "CREDIT_NOTE",
  "REPLACEMENT",
  "PARTIAL_PAYMENT",
  "RELEASE_PAYMENT",
  "REJECT",
  "ESCALATE",
]);
export type ActionType = z.infer<typeof ActionTypeSchema>;

export const DisputeTypeSchema = z.enum([
  "PAYMENT_DELAY",
  "SHORT_PAYMENT",
  "DUPLICATE_INVOICE",
  "PRICE_MISMATCH",
  "QTY_MISMATCH",
  "MISSING_GRN",
  "OTHER",
]);
export type DisputeType = z.infer<typeof DisputeTypeSchema>;

export const DisputePrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type DisputePriority = z.infer<typeof DisputePrioritySchema>;

export const MatchStatusSchema = z.enum([
  "PERFECT_MATCH",
  "PRICE_DISCREPANCY",
  "QUANTITY_DISCREPANCY",
  "MISSING_RECEIPT",
  "ALREADY_PAID",
  "NOT_FOUND",
]);
export type MatchStatus = z.infer<typeof MatchStatusSchema>;

export const VendorMessageInputSchema = z.object({
  message: z.string().min(1).max(10000),
  thread_id: z.string().nullable().optional(),
  sender: z.string().nullable().optional(),
});
export type VendorMessageInput = z.infer<typeof VendorMessageInputSchema>;

export const ResolutionReviewSchema = z.object({
  approved: z.boolean(),
  reviewer_id: z.string().min(1).max(100),
  comments: z.string().max(1000).default(""),
  override_amount: z.number().nullable().optional(),
  override_action: ActionTypeSchema.nullable().optional(),
});
export type ResolutionReview = z.infer<typeof ResolutionReviewSchema>;

export const TriageResultSchema = z.object({
  dispute_type: DisputeTypeSchema,
  priority: DisputePrioritySchema,
  confidence: z.number().min(0).max(1),
  extracted_ids: z.array(z.string()).default([]),
  vendor_name: z.string().nullable().optional(),
  disputed_amount: z.number().nullable().optional(),
  summary: z.string().default(""),
});
export type TriageResult = z.infer<typeof TriageResultSchema>;

export const ThreeWayMatchResultSchema = z.object({
  invoice_id: z.string(),
  po_id: z.string(),
  grn_id: z.string().nullable().optional(),
  status: MatchStatusSchema,
  discrepancies: z.array(z.string()).default([]),
  is_matched: z.boolean(),
  billed_amount: z.number().default(0),
  authorized_amount: z.number().default(0),
});
export type ThreeWayMatchResult = z.infer<typeof ThreeWayMatchResultSchema>;

export const ResolutionProposalSchema = z.object({
  action: ActionTypeSchema,
  amount: z.number().min(0),
  rationale: z.string(),
  evidence: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
});
export type ResolutionProposal = z.infer<typeof ResolutionProposalSchema>;

export const RetrievedPolicySchema = z.object({
  id: z.string().optional(),
  title: z.string().default("SOP Document"),
  section: z.string().default("General"),
  score: z.number().optional(),
  text: z.string(),
});
export type RetrievedPolicy = z.infer<typeof RetrievedPolicySchema>;

export const ExecutionResultSchema = z.object({
  success: z.boolean(),
  action: ActionTypeSchema.or(z.string()),
  audit_id: z.string(),
  message: z.string(),
});
export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;

export const VendOpsStateSchema = z.object({
  thread_id: z.string(),
  raw_message: z.string().default(""),
  normalized_message: z.string().default(""),
  language_detected: z.string().default("en"),
  token_fertility: z.number().default(1.0),
  provenance_ids: z.array(z.string()).default([]),
  triage: TriageResultSchema.nullable().optional(),
  erp_data: z.record(z.any()).default({}),
  match_result: ThreeWayMatchResultSchema.nullable().optional(),
  retrieved_policies: z.array(RetrievedPolicySchema).default([]),
  proposal: ResolutionProposalSchema.nullable().optional(),
  hitl_required: z.boolean().default(false),
  hitl_approved: z.boolean().nullable().optional(),
  hitl_reviewer_id: z.string().nullable().optional(),
  hitl_comments: z.string().nullable().optional(),
  execution_result: ExecutionResultSchema.nullable().optional(),
  response: z.string().nullable().optional(),
  tool_call_errors: z.array(z.string()).default([]),
  repair_attempts: z.number().default(0),
  messages: z.array(z.record(z.any())).default([]),
});
export type VendOpsState = z.infer<typeof VendOpsStateSchema>;

export const DisputeListItemSchema = z.object({
  thread_id: z.string(),
  message: z.string(),
  sender: z.string().nullable().optional(),
  created_at: z.string(),
  status: z.string().default("INITIALIZED"),
  dispute_type: DisputeTypeSchema.nullable().optional(),
  priority: DisputePrioritySchema.nullable().optional(),
  amount: z.number().nullable().optional(),
  action: ActionTypeSchema.nullable().optional(),
  language: z.string().nullable().optional(),
});
export type DisputeListItem = z.infer<typeof DisputeListItemSchema>;

export const ApprovalQueueItemSchema = z.object({
  thread_id: z.string(),
  created_at: z.string().optional(),
  raw_message: z.string().optional(),
  interrupt: z.object({
    reason: z.string().optional(),
    action: z.string().optional(),
    amount: z.number().optional(),
    evidence: z.array(z.string()).optional(),
    thread_id: z.string().optional(),
  }),
  proposal: ResolutionProposalSchema.optional(),
  match_result: ThreeWayMatchResultSchema.nullable().optional(),
});
export type ApprovalQueueItem = z.infer<typeof ApprovalQueueItemSchema>;
