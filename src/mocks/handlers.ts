import { http, HttpResponse } from "msw";
import {
  MOCK_APPROVALS,
  MOCK_AUDIT,
  MOCK_DISPUTES,
  MOCK_EVALS,
  MOCK_GUARD_EVENTS,
} from "./data";

export const handlers = [
  // Health
  http.get("/api/health", () => {
    return HttpResponse.json({
      status: "healthy",
      service: "VendOps Dispute Resolution & RAG Service (MSW Mock)",
      docs: "/docs",
      services: { api: "healthy", qdrant: "healthy", mcp: "healthy" },
    });
  }),
  http.get("/api/healthz", () => {
    return HttpResponse.json({ status: "healthy", services: { api: "healthy", qdrant: "healthy" } });
  }),

  // Disputes
  http.get("/api/backend/disputes", () => {
    return HttpResponse.json(MOCK_DISPUTES);
  }),

  http.post("/api/backend/disputes", async ({ request }) => {
    const body = (await request.json()) as any;
    const threadId = body.thread_id || `thread_mock_${Date.now()}`;
    return HttpResponse.json({
      thread_id: threadId,
      status: "INITIALIZED",
      state: {
        thread_id: threadId,
        raw_message: body.message,
        normalized_message: body.message.trim(),
        language_detected: "hi-Latn",
        token_fertility: 1.45,
        provenance_ids: ["INV-20240103", "PO-20240103"],
        triage: {
          dispute_type: "SHORT_PAYMENT",
          priority: "HIGH",
          confidence: 0.94,
          extracted_ids: ["INV-20240103", "PO-20240103"],
          disputed_amount: 25000.0,
          summary: "Vendor reports 25 units short payment on INV-20240103.",
        },
        erp_data: {},
        match_result: {
          invoice_id: "INV-20240103",
          po_id: "PO-20240103",
          grn_id: "GRN-20240103",
          status: "QUANTITY_DISCREPANCY",
          discrepancies: ["Dock intake confirmed 25 units accepted out of 50 units billed."],
          is_matched: false,
          billed_amount: 50000.0,
          authorized_amount: 25000.0,
        },
        retrieved_policies: [
          {
            title: "SOP-INV-002: Short Shipment Resolution",
            section: "3. Automated Partial Payment",
            score: 0.88,
            text: "Authorize partial payment for accepted items; balance requires vendor credit note.",
          },
        ],
        proposal: {
          action: "PARTIAL_PAYMENT",
          amount: 25000.0,
          rationale: "Authorizing disbursement for verified warehouse dock receipt. Credit note issued for remaining $25k.",
          evidence: ["GRN-20240103: 25 units accepted", "Unit price $1,000.00 confirmed on PO-20240103"],
          confidence: 0.96,
        },
        hitl_required: false,
        hitl_approved: null,
        execution_result: {
          success: true,
          action: "PARTIAL_PAYMENT",
          audit_id: "AUD-MOCK-001",
          message: "Resolution executed: PARTIAL_PAYMENT for $25,000.00.",
        },
        response: "Namaste! Aapka invoice INV-20240103 verify ho gaya hai. 25 units ka $25,000.00 partial payment release kar diya gaya hai.",
        tool_call_errors: [],
        repair_attempts: 0,
        messages: [{ role: "user", content: body.message }],
      },
    });
  }),

  http.get("/api/backend/disputes/:id", ({ params }) => {
    const id = params.id as string;
    const match = MOCK_DISPUTES.find((d) => d.thread_id === id) || MOCK_DISPUTES[0];
    return HttpResponse.json({
      thread_id: id,
      status: match.status,
      is_interrupted: match.status === "WAITING_APPROVAL",
      pending_interrupt: match.status === "WAITING_APPROVAL" ? MOCK_APPROVALS[0].interrupt : null,
      state: {
        thread_id: id,
        raw_message: match.message,
        normalized_message: match.message,
        language_detected: match.language,
        token_fertility: 1.35,
        provenance_ids: ["INV-20240103", "PO-20240103"],
        triage: {
          dispute_type: match.dispute_type,
          priority: match.priority,
          confidence: 0.95,
          extracted_ids: ["INV-20240103", "PO-20240103"],
          disputed_amount: match.amount,
          summary: `Dispute investigation for ${match.dispute_type}.`,
        },
        erp_data: {},
        match_result: {
          invoice_id: "INV-20240103",
          po_id: "PO-20240103",
          grn_id: "GRN-20240103",
          status: "PERFECT_MATCH",
          discrepancies: [],
          is_matched: true,
          billed_amount: match.amount || 25000.0,
          authorized_amount: match.amount || 25000.0,
        },
        retrieved_policies: [],
        proposal: {
          action: match.action || "RELEASE_PAYMENT",
          amount: match.amount || 25000.0,
          rationale: "Audit verified against ERP.",
          evidence: ["PO rate confirmed", "GRN intake complete"],
          confidence: 0.96,
        },
        hitl_required: match.status === "WAITING_APPROVAL",
        hitl_approved: null,
        execution_result: {
          success: true,
          action: match.action || "RELEASE_PAYMENT",
          audit_id: "AUD-MOCK-001",
          message: "Resolution completed.",
        },
        response: "Your dispute has been processed and resolution logged in ERP.",
        tool_call_errors: [],
        repair_attempts: 0,
        messages: [],
      },
    });
  }),

  // Approvals
  http.get("/api/backend/approvals", () => {
    return HttpResponse.json(MOCK_APPROVALS);
  }),

  http.post("/api/backend/disputes/:id/resume", async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as any;
    return HttpResponse.json({
      thread_id: id,
      status: "RESUMED",
      review: body,
      state: {
        thread_id: id,
        hitl_approved: body.approved,
        hitl_reviewer_id: body.reviewer_id,
        hitl_comments: body.comments,
        execution_result: {
          success: body.approved,
          action: body.override_action || "RELEASE_PAYMENT",
          audit_id: `AUD-APP-${Date.now().toString().slice(-6)}`,
          message: body.approved ? "Approved by reviewer and executed in ERP." : "Rejected by reviewer.",
        },
        response: body.approved ? "Resolution approved and funds released." : "Dispute rejected following manager review.",
      },
    });
  }),

  // Audit
  http.get("/api/backend/audit", () => {
    return HttpResponse.json(MOCK_AUDIT);
  }),

  // Guard
  http.get("/api/backend/guard/events", () => {
    return HttpResponse.json(MOCK_GUARD_EVENTS);
  }),

  // ERP
  http.get("/api/backend/erp/invoices", () => {
    return HttpResponse.json([
      {
        invoice_id: "INV-20240001",
        po_id: "PO-20240001",
        vendor_id: "VND-000001",
        lines: [{ line_number: 1, item_sku: "SKU-STEEL-01", description: "Steel Sheet 2mm", billed_qty: 100, unit_price: 50.0, total_price: 5000.0 }],
        total_amount: 5000.0,
        currency: "USD",
        invoice_date: "2024-01-16",
        due_date: "2024-02-15",
        status: "PENDING",
      },
      {
        invoice_id: "INV-20240002",
        po_id: "PO-20240002",
        vendor_id: "VND-000002",
        lines: [{ line_number: 1, item_sku: "SKU-CHIP-01", description: "MCU Cortex-M4", billed_qty: 50, unit_price: 100.0, total_price: 5000.0 }],
        total_amount: 5000.0,
        currency: "USD",
        invoice_date: "2024-02-06",
        due_date: "2024-03-08",
        status: "APPROVED",
      },
      {
        invoice_id: "INV-20240999",
        po_id: "PO-20240999",
        vendor_id: "VND-000999",
        lines: [{ line_number: 1, item_sku: "SRV-CORE-01", description: "Core Enterprise Turbine", billed_qty: 1, unit_price: 120000.0, total_price: 120000.0 }],
        total_amount: 120000.0,
        currency: "USD",
        invoice_date: "2024-04-01",
        due_date: "2024-05-01",
        status: "DISPUTED",
      },
    ]);
  }),

  http.get("/api/backend/erp/purchase-orders", () => {
    return HttpResponse.json([
      {
        po_id: "PO-20240001",
        vendor_id: "VND-000001",
        lines: [{ line_number: 1, item_sku: "SKU-STEEL-01", description: "Steel Sheet 2mm", ordered_qty: 100, unit_price: 50.0, currency: "USD" }],
        total_amount: 5000.0,
        currency: "USD",
        created_date: "2024-01-05",
      },
      {
        po_id: "PO-20240999",
        vendor_id: "VND-000999",
        lines: [{ line_number: 1, item_sku: "SRV-CORE-01", description: "Core Enterprise Turbine", ordered_qty: 1, unit_price: 120000.0, currency: "USD" }],
        total_amount: 120000.0,
        currency: "USD",
        created_date: "2024-03-15",
      },
    ]);
  }),

  http.get("/api/backend/erp/grns", () => {
    return HttpResponse.json([
      {
        grn_id: "GRN-20240001",
        po_id: "PO-20240001",
        vendor_id: "VND-000001",
        lines: [{ line_number: 1, item_sku: "SKU-STEEL-01", received_qty: 100, accepted_qty: 100, rejected_qty: 0 }],
        received_date: "2024-01-14",
      },
      {
        grn_id: "GRN-20240999",
        po_id: "PO-20240999",
        vendor_id: "VND-000999",
        lines: [{ line_number: 1, item_sku: "SRV-CORE-01", received_qty: 1, accepted_qty: 1, rejected_qty: 0 }],
        received_date: "2024-03-28",
      },
    ]);
  }),

  http.get("/api/backend/erp/vendors", () => {
    return HttpResponse.json([
      { vendor_id: "VND-000001", name: "Apex Steel Industries", payment_terms_days: 30, status: "ACTIVE", currency: "USD" },
      { vendor_id: "VND-000002", name: "Silicon Microelectronics", payment_terms_days: 30, status: "ACTIVE", currency: "USD" },
      { vendor_id: "VND-000999", name: "Apex Turbine Systems Corp", payment_terms_days: 45, status: "ACTIVE", currency: "USD" },
    ]);
  }),

  // Quality Evals
  http.get("/api/backend/evals/latest", () => {
    return HttpResponse.json(MOCK_EVALS);
  }),
];
