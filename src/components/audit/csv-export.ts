import { AuditEntry } from "@/lib/schemas/erp";
import { formatKolkataTime } from "@/lib/utils";

function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If field contains quotes, commas, or newlines, escape quotes by doubling them and enclose in quotes
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportAuditLedgerToCsv(
  entries: AuditEntry[],
  filenamePrefix = "vendops_audit_ledger"
): string {
  const headers = [
    "Timestamp (Asia/Kolkata)",
    "Timestamp (ISO UTC)",
    "Audit ID",
    "Invoice ID",
    "PO ID",
    "Vendor ID",
    "Action",
    "Authorized Amount (USD)",
    "Reviewer ID",
    "Idempotency Key",
    "Rationale",
  ];

  const rows = entries.map((e) => [
    escapeCsvField(formatKolkataTime(e.timestamp)),
    escapeCsvField(e.timestamp),
    escapeCsvField(e.audit_id),
    escapeCsvField(e.invoice_id),
    escapeCsvField(e.po_id || "—"),
    escapeCsvField(e.vendor_id),
    escapeCsvField(e.action),
    escapeCsvField(e.amount.toFixed(2)),
    escapeCsvField(e.reviewer_id || "SYS-AUTONOMOUS"),
    escapeCsvField(e.idempotency_key),
    escapeCsvField(e.rationale),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  // UTF-8 BOM so Excel and spreadsheet viewers handle characters smoothly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const timestamp = Date.now();
  const filename = `${filenamePrefix}_${timestamp}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}
