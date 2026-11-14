import { z } from "zod";
import { ActionTypeSchema } from "./dispute";

export const InvoiceLineSchema = z.object({
  line_number: z.number(),
  item_sku: z.string(),
  description: z.string(),
  billed_qty: z.number(),
  unit_price: z.number(),
  total_price: z.number(),
});

export const InvoiceSchema = z.object({
  invoice_id: z.string(),
  po_id: z.string(),
  vendor_id: z.string(),
  lines: z.array(InvoiceLineSchema).default([]),
  total_amount: z.number(),
  currency: z.string().default("USD"),
  invoice_date: z.string(),
  due_date: z.string(),
  status: z.string().default("PENDING"),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const POLineSchema = z.object({
  line_number: z.number(),
  item_sku: z.string(),
  description: z.string(),
  ordered_qty: z.number(),
  unit_price: z.number(),
  currency: z.string().default("USD"),
});

export const PurchaseOrderSchema = z.object({
  po_id: z.string(),
  vendor_id: z.string(),
  lines: z.array(POLineSchema).default([]),
  total_amount: z.number(),
  currency: z.string().default("USD"),
  created_date: z.string(),
});
export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;

export const GRNLineSchema = z.object({
  line_number: z.number(),
  item_sku: z.string(),
  received_qty: z.number(),
  accepted_qty: z.number(),
  rejected_qty: z.number().default(0),
  rejection_reason: z.string().nullable().optional(),
});

export const GoodsReceiptNoteSchema = z.object({
  grn_id: z.string(),
  po_id: z.string(),
  vendor_id: z.string(),
  lines: z.array(GRNLineSchema).default([]),
  received_date: z.string(),
});
export type GoodsReceiptNote = z.infer<typeof GoodsReceiptNoteSchema>;

export const VendorSchema = z.object({
  vendor_id: z.string(),
  name: z.string(),
  payment_terms_days: z.number().default(30),
  status: z.string().default("ACTIVE"),
  currency: z.string().default("USD"),
});
export type Vendor = z.infer<typeof VendorSchema>;

export const AuditEntrySchema = z.object({
  audit_id: z.string(),
  timestamp: z.string(),
  action: ActionTypeSchema.or(z.string()),
  invoice_id: z.string(),
  po_id: z.string().nullable().optional(),
  vendor_id: z.string(),
  amount: z.number(),
  rationale: z.string(),
  idempotency_key: z.string(),
  reviewer_id: z.string().nullable().optional(),
});
export type AuditEntry = z.infer<typeof AuditEntrySchema>;
