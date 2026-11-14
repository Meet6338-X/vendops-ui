import { fetchJson } from "./client";
import {
  ApprovalQueueItem,
  ApprovalQueueItemSchema,
  DisputeListItem,
  DisputeListItemSchema,
  ResolutionReview,
  VendOpsState,
  VendOpsStateSchema,
  VendorMessageInput,
} from "../schemas/dispute";
import {
  AuditEntry,
  AuditEntrySchema,
  GoodsReceiptNote,
  GoodsReceiptNoteSchema,
  Invoice,
  InvoiceSchema,
  PurchaseOrder,
  PurchaseOrderSchema,
  Vendor,
  VendorSchema,
} from "../schemas/erp";
import {
  GuardEvent,
  GuardEventSchema,
  ReleaseGateResponse,
  ReleaseGateResponseSchema,
} from "../schemas/evals";
import { z } from "zod";

// --- System & Health ---
export async function getHealth(): Promise<{ status: string; services: Record<string, string> }> {
  return fetchJson<{ status: string; services: Record<string, string> }>("/api/health");
}

// --- Disputes ---
export async function createDispute(payload: VendorMessageInput): Promise<{ thread_id: string; status: string; state: VendOpsState }> {
  const data = await fetchJson<{ thread_id: string; status: string; state: unknown }>("/api/backend/disputes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    ...data,
    state: VendOpsStateSchema.parse(data.state),
  };
}

export async function getDispute(threadId: string): Promise<{ thread_id: string; status: string; is_interrupted: boolean; pending_interrupt: unknown; state: VendOpsState }> {
  const data = await fetchJson<{ thread_id: string; status: string; is_interrupted: boolean; pending_interrupt: unknown; state: unknown }>(
    `/api/backend/disputes/${encodeURIComponent(threadId)}`
  );
  return {
    ...data,
    state: VendOpsStateSchema.parse(data.state),
  };
}

export async function listDisputes(limit = 50): Promise<DisputeListItem[]> {
  const data = await fetchJson<unknown[]>(`/api/backend/disputes?limit=${limit}`);
  return z.array(DisputeListItemSchema).parse(data);
}

// --- Approvals ---
export async function listPendingApprovals(): Promise<ApprovalQueueItem[]> {
  const data = await fetchJson<unknown[]>("/api/backend/approvals");
  return z.array(ApprovalQueueItemSchema).parse(data);
}

export async function resumeDispute(threadId: string, review: ResolutionReview): Promise<{ thread_id: string; status: string; state: VendOpsState }> {
  const data = await fetchJson<{ thread_id: string; status: string; state: unknown }>(
    `/api/backend/disputes/${encodeURIComponent(threadId)}/resume`,
    {
      method: "POST",
      body: JSON.stringify(review),
    }
  );
  return {
    ...data,
    state: VendOpsStateSchema.parse(data.state),
  };
}

// --- Audit & Guard ---
export async function listAuditLog(limit = 100): Promise<AuditEntry[]> {
  const data = await fetchJson<unknown[]>(`/api/backend/audit?limit=${limit}`);
  return z.array(AuditEntrySchema).parse(data);
}

export async function listGuardEvents(limit = 50): Promise<GuardEvent[]> {
  const data = await fetchJson<unknown[]>(`/api/backend/guard/events?limit=${limit}`);
  return z.array(GuardEventSchema).parse(data);
}

// --- ERP Browse ---
export async function listInvoices(limit = 50): Promise<Invoice[]> {
  const data = await fetchJson<unknown[]>(`/api/backend/erp/invoices?limit=${limit}`);
  return z.array(InvoiceSchema).parse(data);
}

export async function listPurchaseOrders(limit = 50): Promise<PurchaseOrder[]> {
  const data = await fetchJson<unknown[]>(`/api/backend/erp/purchase-orders?limit=${limit}`);
  return z.array(PurchaseOrderSchema).parse(data);
}

export async function listGRNs(limit = 50): Promise<GoodsReceiptNote[]> {
  const data = await fetchJson<unknown[]>(`/api/backend/erp/grns?limit=${limit}`);
  return z.array(GoodsReceiptNoteSchema).parse(data);
}

export async function listVendors(limit = 50): Promise<Vendor[]> {
  const data = await fetchJson<unknown[]>(`/api/backend/erp/vendors?limit=${limit}`);
  return z.array(VendorSchema).parse(data);
}

// --- Evals & Benchmark ---
export async function getLatestEvals(): Promise<ReleaseGateResponse> {
  const data = await fetchJson<unknown>("/api/backend/evals/latest");
  return ReleaseGateResponseSchema.parse(data);
}
