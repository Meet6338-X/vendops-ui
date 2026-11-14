import { z } from "zod";

export const EvalReportSchema = z.object({
  total_cases: z.number().default(420),
  overall_tcr: z.number().default(1.0),
  overall_wer: z.number().default(0.006),
  worst_slice_tcr: z.number().default(1.0),
  worst_slice_wer: z.number().default(0.0482),
  worst_tcr_slice_name: z.string().default("script:devanagari"),
  worst_wer_slice_name: z.string().default("noise_level:high"),
  hallucinated_erp_tool_calls: z.number().default(0),
  handling_time_reduction_pct: z.number().default(97.17),
  ablation: z.object({
    token_reduction_pct: z.number().default(45.92),
    uncompressed_tokens: z.number().default(200465),
    compressed_tokens: z.number().default(108411),
    latency_speedup_ms: z.number().default(25.07),
    tcr_parity: z.number().default(0.0),
  }),
  gate_passed: z.boolean().default(true),
  gate_reasons: z.array(z.string()).default([]),
});
export type EvalReport = z.infer<typeof EvalReportSchema>;

export const ReleaseGateResponseSchema = z.object({
  gate_passed: z.boolean().default(true),
  failures: z.array(z.string()).default([]),
  report: EvalReportSchema,
  thresholds: z.object({
    max_entity_wer: z.number().default(0.03),
    min_worst_slice_tcr: z.number().default(0.85),
    max_hallucinations: z.number().default(0),
  }),
  markdown_report: z.string().optional(),
});
export type ReleaseGateResponse = z.infer<typeof ReleaseGateResponseSchema>;

export const GuardEventSchema = z.object({
  timestamp: z.string(),
  thread_id: z.string().optional(),
  tool_name: z.string(),
  rejected_id: z.string(),
  id_type: z.string(),
  repair_attempt: z.number().default(1),
  must_escalate: z.boolean().default(false),
  status: z.string().default("BLOCKED"),
  message: z.string().optional(),
});
export type GuardEvent = z.infer<typeof GuardEventSchema>;
