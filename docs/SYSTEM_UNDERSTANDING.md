# System Understanding: VendOps & Web UI Integration

This document captures the verified architecture of the VendOps backend (`..\VendOps-Agentic-Harness`), its active API contracts, SSE streaming wire formats, graph state variables, evaluation artifacts, and the precise gaps required to build the web UI.

---

## (a) What VendOps Does (10-Line Core Summary)

1. VendOps is an autonomous agentic harness for Accounts Payable (AP) departments to triage and resolve vendor invoice disputes.
2. It ingests messy vendor inquiries written in standard English, phonetic Roman-script Hinglish, or mixed Devanagari.
3. It normalizes scripts, converts Devanagari digits (`०-९` -> `0-9`), and strips email signatures.
4. It measures token fertility per language slice and applies adaptive context compression while preserving 100% of canonical IDs.
5. It categorizes inquiries into 7 discrete `DisputeType` buckets (Payment Delay, Short Payment, Price Mismatch, Qty Mismatch, Missing GRN, Duplicate, Other).
6. It queries enterprise ERP tables (PO, GRN, Invoice, Payment) via Model Context Protocol (MCP 2.x) tools to run a 3-way reconciliation.
7. It retrieves company Standard Operating Procedures (SOPs) and historical dispute precedents from a Qdrant vector database using multilingual embeddings.
8. It formulates a `ResolutionProposal` and enforces a Zero-Hallucination Provenance Guard, blocking 100% of unverified or invented entity IDs.
9. High-value claims ($\ge \$100,000$), sensitive actions, or low-confidence proposals trigger a LangGraph `interrupt()` Human-in-the-Loop (HITL) gate.
10. Upon clearance, it executes ERP mutations via an enum-restricted write tool with client idempotency and responds in the vendor's language style.

---

## (b) Real API Endpoint Inventory & Request/Response Shapes

The live backend runs on FastAPI (port `8000`). Verified from `http://localhost:8000/openapi.json` and `src/vendops/api/routes.py`:

### 1. `GET /health` & `GET /healthz` & `GET /`
- **Purpose**: Liveness and readiness probe for API and Qdrant.
- **Request**: No body, no query parameters.
- **Response** (`200 OK` or `503 Service Unavailable`):
  ```json
  {
    "status": "healthy",
    "service": "VendOps Dispute Resolution & RAG Service",
    "docs": "/docs",
    "timestamp": "2026-11-14T10:34:33.057959",
    "services": {
      "api": "healthy",
      "qdrant": "healthy"
    }
  }
  ```

### 2. `POST /api/v1/disputes`
- **Purpose**: Initialize a new dispute thread in the LangGraph state machine.
- **Request Body** (`VendorMessageInput`):
  ```json
  {
    "message": "string (min_length: 1, max_length: 10000)",
    "thread_id": "string | null (optional client-generated thread ID)",
    "sender": "string | null (optional vendor email or name)"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "thread_id": "thread_b867f05e304a",
    "status": "INITIALIZED",
    "state": {
      "thread_id": "thread_b867f05e304a",
      "raw_message": "...",
      "normalized_message": "...",
      "language_detected": "en",
      "token_fertility": 1.0,
      "provenance_ids": [],
      "triage": null,
      "erp_data": {},
      "match_result": null,
      "retrieved_policies": [],
      "proposal": null,
      "hitl_required": false,
      "hitl_approved": null,
      "hitl_reviewer_id": null,
      "hitl_comments": null,
      "execution_result": null,
      "response": null,
      "tool_call_errors": [],
      "repair_attempts": 0,
      "messages": [{"role": "user", "content": "..."}]
    }
  }
  ```

### 3. `GET /api/v1/disputes/{thread_id}/stream`
- **Purpose**: Server-Sent Events (SSE) streaming of real-time graph execution.
- **Headers**: `Accept: text/event-stream`
- **Exact SSE Event Types**:
  1. **`event: node_transition`**: Emitted as each LangGraph node finishes execution.
     ```text
     event: node_transition
     data: {
       "thread_id": "thread_...",
       "node": "triage" | "rag_retrieval" | "reconcile" | "propose" | "hitl_gate" | "execute" | "respond",
       "update": { ...state diff produced by the node... }
     }
     ```
  2. **`event: interrupt`**: Emitted when execution reaches `hitl_gate` and pauses.
     ```text
     event: interrupt
     data: {
       "thread_id": "thread_...",
       "status": "WAITING_APPROVAL",
       "interrupt": {
         "reason": "Amount exceeds HIGH_VALUE_THRESHOLD ($100,000.00)",
         "action": "RELEASE_PAYMENT",
         "amount": 120000.0,
         "evidence": ["..."],
         "thread_id": "thread_..."
       }
     }
     ```
  3. **`event: token`**: Emitted when LLM streams token chunks.
     ```text
     event: token
     data: {
       "thread_id": "thread_...",
       "token": "..."
     }
     ```
  4. **`event: end`**: Emitted upon workflow completion.
     ```text
     event: end
     data: {
       "thread_id": "thread_...",
       "status": "COMPLETED",
       "final_state": { ...full VendOpsState dictionary... }
     }
     ```
  5. **`event: error`**: Emitted on unhandled pipeline exception.
     ```text
     event: error
     data: {
       "thread_id": "thread_...",
       "error": "Error description string"
     }
     ```

### 4. `POST /api/v1/disputes/{thread_id}/resume`
- **Purpose**: Resumes an interrupted dispute workflow with reviewer approval or rejection.
- **Request Body** (`ResolutionReview`):
  ```json
  {
    "approved": true,
    "reviewer_id": "string (min_length: 1, max_length: 100, e.g. 'REV-DIR-402')",
    "comments": "string (max_length: 1000, default: '')",
    "override_amount": 100000.0,
    "override_action": "PARTIAL_PAYMENT | RELEASE_PAYMENT | CREDIT_NOTE | REPLACEMENT | REJECT | ESCALATE | null"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "thread_id": "thread_...",
    "status": "RESUMED",
    "review": {
      "approved": true,
      "reviewer_id": "REV-DIR-402",
      "comments": "..."
    },
    "state": { ...updated VendOpsState... }
  }
  ```
- **Error Codes**:
  - `404 Not Found`: If `thread_id` does not exist in state checkpointer.
  - `400 Bad Request`: If thread is NOT currently in an interrupted state awaiting review.

---

## (c) Graph State Fields the UI Can Display

The UI consumes the full `VendOpsState` TypedDict:
- `raw_message`: Original incoming email/chat text.
- `normalized_message`: Transliterated, cleaned text with highlighted entities.
- `language_detected`: Language badge (`en` = English, `hi-Latn` = Roman Hinglish, `hi` = Devanagari, `mixed`).
- `token_fertility`: Numerical ratio (tokens/word), e.g. `2.85`.
- `provenance_ids`: List of verified entity IDs (`INV-...`, `PO-...`, `GRN-...`, `VND-...`).
- `triage`:
  - `dispute_type`: Enum string (`PAYMENT_DELAY`, `SHORT_PAYMENT`, `PRICE_MISMATCH`, etc.).
  - `priority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
  - `confidence`: Floating-point scalar (`0.0` to `1.0`).
  - `disputed_amount`: Disputed dollar value.
  - `summary`: One-line analytical synopsis.
- `match_result`:
  - `status`: `PERFECT_MATCH`, `QUANTITY_DISCREPANCY`, `PRICE_DISCREPANCY`, `MISSING_RECEIPT`, `ALREADY_PAID`, `NOT_FOUND`.
  - `is_matched`: Boolean.
  - `billed_amount` vs `authorized_amount`.
  - `discrepancies`: List of explanatory discrepancy notes.
- `retrieved_policies`: List of SOP chunks with `title`, `section`, `score`, and `text`.
- `proposal`:
  - `action`: `CREDIT_NOTE`, `REPLACEMENT`, `PARTIAL_PAYMENT`, `RELEASE_PAYMENT`, `REJECT`, `ESCALATE`.
  - `amount`: Recommended settlement amount.
  - `rationale`: Executive explanation.
  - `evidence`: Bulleted supporting citations.
  - `confidence`: Confidence score.
- `hitl_required`: Boolean gate flag.
- `hitl_approved`: Boolean decision (`true`, `false`, or `null` if pending).
- `hitl_reviewer_id`: Identity of the approving staff member.
- `hitl_comments`: Audit notes left by reviewer.
- `execution_result`:
  - `success`: Boolean.
  - `action`: Action executed.
  - `audit_id`: Unique ledger audit pointer (e.g. `AUD-5ACCE094`).
  - `idempotency_key`: Deduplication key.
  - `message`: Mutation summary.
- `response`: Grounded response text in vendor's input dialect.
- `tool_call_errors`: List of guard-blocked or repaired candidate tool calls.
- `repair_attempts`: Number of retry attempts consumed ($0, 1, 2$).

---

## (d) Where Eval Results Are Stored & Their Exact Shape

Evaluation results reside in `..\VendOps-Agentic-Harness\evals\results\`:
1. `evals/results/latest_report.json`:
   ```json
   {
     "total_cases": 420,
     "overall_tcr": 1.0,
     "overall_wer": 0.006,
     "worst_slice_tcr": 1.0,
     "worst_slice_wer": 0.0482,
     "worst_tcr_slice_name": "script:devanagari",
     "worst_wer_slice_name": "noise_level:high",
     "hallucinated_erp_tool_calls": 0,
     "handling_time_reduction_pct": 97.17,
     "ablation": {
       "token_reduction_pct": 45.92,
       "uncompressed_tokens": 200465,
       "compressed_tokens": 108411,
       "latency_speedup_ms": 25.07,
       "tcr_parity": 0.0
     },
     "gate_passed": true,
     "gate_reasons": []
   }
   ```
2. `evals/results/release_gate_summary.json`:
   Contains the same report alongside configured gate thresholds (`max_entity_wer: 0.03`, `min_worst_slice_tcr: 0.85`, `max_hallucinations: 0`).
3. `evals/results/latest_report.md`:
   Contains the full markdown tables with detailed per-slice metrics for `script`, `code_mix_index`, `token_fertility_bucket`, `thread_length`, `noise_level`, and `entity_type`.

---

## (e) Backend Gaps Analysis: Data the UI Needs with No Current Endpoint

Currently, the backend only exposes thread initialization, streaming, and resume endpoints. The UI requires several additive endpoints to power all 8 planned screens:

| Required UI View | Data Needed | Current Backend Reality | Gap Status |
|---|---|---|---|
| **`/` (Overview)** | Total dispute volume, count of auto-resolved vs pending approval vs escalated, handling-time stats. | Memory/SQLite checkpointer stores thread state, but no aggregate metrics endpoint exists. | **GAP** |
| **`/disputes` & history** | Table of past disputes (threads, vendor, timestamp, status, dispute_type). | No endpoint exists to query historical dispute sessions. | **GAP** |
| **`/disputes/[id]` (Direct)** | Fetching static dispute state on direct navigation or page refresh without re-streaming. | Only `POST /disputes` and `GET /stream` exist; no `GET /api/v1/disputes/{thread_id}` exists. | **GAP** |
| **`/approvals`** | List of pending HITL interrupts awaiting reviewer action. | No query endpoint exists to discover which threads have suspended tasks in checkpointer. | **GAP** |
| **`/audit`** | Audit ledger records (action, amount, invoice, reviewer, timestamp, idempotency key). | SQLite database table `audit_log` exists in `db.py`, but has no REST API endpoint. | **GAP** |
| **`/erp`** | Read-only explorer for ERP tables (`vendors`, `purchase_orders`, `goods_receipt_notes`, `invoices`). | SQLite database contains all records, but FastAPI router has no endpoints to browse them. | **GAP** |
| **`/quality`** | Eval metrics, benchmark scores, slice heatmap, and compression ablation. | Results exist on disk (`evals/results/latest_report.json`), but no API endpoint serves them. | **GAP** |
| **`/guard`** | Guard event log (provenance rejections, schema validation failures, repair attempts). | Events exist only within individual thread state dictionaries; no system-wide audit feed exists. | **GAP** |

---

## Conclusion & Action Plan
Until the backend gaps are approved and implemented in `..\VendOps-Agentic-Harness`, the frontend UI will be built contract-first against a **Mock Service Worker (MSW)** typed layer that implements the exact target schemas.
