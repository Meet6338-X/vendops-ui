# AGENTS.md - VendOps Web UI Operating Contract

This document governs frontend conventions, file ownership, design system standards, and development rules for the **VendOps Web UI** (`vendops-ui`).

---

## 1. Non-Negotiable Frontend Rules

1. **Frozen Shared Directories**:
   - `src/lib/api/`
   - `src/lib/schemas/`
   - `src/components/ui/`
   - `src/components/layout/`
   - `docs/SYSTEM_UNDERSTANDING.md`
   These directories are **FROZEN** after Phase A. No subagent may modify them without Staff Orchestrator approval.

2. **Zod Validation at Every Boundary**:
   - Every API fetch response and Server-Sent Event (SSE) payload MUST be validated with Zod at runtime.
   - Malformed data must surface a graceful fallback or error banner—never cause uncaught React runtime crashes.

3. **No Fake Optimistic Approvals**:
   - The `/approvals` screen MUST NOT fake or optimistically confirm approvals. Action buttons must show a pending spinner and reflect backend-confirmed state only.

4. **Mandatory Source Attribution on All Metrics**:
   - Every metric card or chart in `/quality` and `/` MUST prominently display its data source badge (*"FakeLLM / synthetic"* vs *"Live LLM"*, dataset name, and case count). Never render an evaluation figure without its provenance.

5. **Theme & Design System Standards**:
   - Follow the **Industrial Dark** specification:
     - Base: `#09090B`
     - Panel backgrounds: `rgba(24, 24, 27, 0.9)` with `backdrop-filter: blur(12px)`
     - Borders: `rgba(63, 63, 70, 0.4)`
     - Primary Blue: `#3b82f6`
     - Typography: `Plus Jakarta Sans` for labels, `JetBrains Mono` for telemetry and numbers
     - Light mode toggle support must be maintained.
   - Do NOT use generic AI slop (e.g. gratuitous purple gradients, unrounded edges on data tables, missing hover/focus rings).

6. **Devanagari & Hinglish Rendering**:
   - Multilingual text blocks must use `font-sans` with proper line-height (`leading-relaxed`) to prevent clipping of vowel marks and ligatures.

---

## 2. Stream File Ownership

Subagents work on isolated Git branches and are restricted to their owned directory paths:

| Stream | Branch | Owned Directories | Read-Only Shared Deps |
|---|---|---|---|
| **Stream 1: RUN-VIEW** | `feat/ui-run-view` | `src/app/disputes/**`<br>`src/components/disputes/**` | `src/lib/**`<br>`src/components/shared/**` |
| **Stream 2: APPROVALS-AUDIT** | `feat/ui-approvals-audit` | `src/app/approvals/**`<br>`src/app/audit/**`<br>`src/components/approvals/**`<br>`src/components/audit/**` | `src/lib/**`<br>`src/components/shared/**` |
| **Stream 3: OVERVIEW-ERP** | `feat/ui-overview-erp` | `src/app/page.tsx`<br>`src/app/erp/**`<br>`src/components/overview/**`<br>`src/components/erp/**` | `src/lib/**`<br>`src/components/shared/**` |
| **Stream 4: QUALITY-GUARD** | `feat/ui-quality-guard` | `src/app/quality/**`<br>`src/app/guard/**`<br>`src/components/quality/**`<br>`src/components/guard/**` | `src/lib/**`<br>`src/components/shared/**` |
| **Stream 5: E2E-QA** | `feat/ui-e2e-qa` | `e2e/**`<br>`tests/**` | All files (read-only) |
