import { z } from "zod";
import { VendOpsStateSchema } from "./dispute";

export const SSENodeTransitionDataSchema = z.object({
  thread_id: z.string(),
  node: z.string(),
  update: z.record(z.any()).nullable().optional(),
});
export type SSENodeTransitionData = z.infer<typeof SSENodeTransitionDataSchema>;

export const SSEInterruptDataSchema = z.object({
  thread_id: z.string(),
  status: z.string().default("WAITING_APPROVAL"),
  interrupt: z.object({
    reason: z.string().optional(),
    message: z.string().optional(),
    action: z.string().optional(),
    amount: z.number().optional(),
    evidence: z.array(z.string()).optional(),
    thread_id: z.string().optional(),
    proposal: z.record(z.any()).optional(),
  }).or(z.record(z.any())),
});
export type SSEInterruptData = z.infer<typeof SSEInterruptDataSchema>;

export const SSETokenDataSchema = z.object({
  thread_id: z.string(),
  token: z.string(),
});
export type SSETokenData = z.infer<typeof SSETokenDataSchema>;

export const SSEEndDataSchema = z.object({
  thread_id: z.string(),
  status: z.string().default("COMPLETED"),
  final_state: VendOpsStateSchema.or(z.record(z.any())),
});
export type SSEEndData = z.infer<typeof SSEEndDataSchema>;

export const SSEErrorDataSchema = z.object({
  thread_id: z.string(),
  error: z.string(),
});
export type SSEErrorData = z.infer<typeof SSEErrorDataSchema>;
