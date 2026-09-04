# CLOSE — API Specification

The CLOSE Finance Controller backend is exposed as a RESTful service built with FastAPI and documented automatically via OpenAPI at `/docs`.

## Base URLs
- Local Development: `http://localhost:8000`
- Production: `https://api.close-finance.internal`

## Endpoints

### System & Health
* `GET /health` — Service health status
* `GET /api/status` — Operational status, batch queue state, confidence thresholds

### Authentication (`/api/auth`)
* `POST /api/auth/login` — Authenticate user and issue session token
* `POST /api/auth/logout` — Revoke active session
* `GET /api/auth/me` — Return current authenticated finance officer profile

### Companies & Accounts (`/api/companies`)
* `GET /api/companies` — List managed company entities
* `POST /api/companies` — Register new company profile
* `GET /api/companies/:id` — Retrieve company financial settings

### Ingestion & Uploads (`/api/uploads`)
* `POST /api/uploads/bank` — Ingest bank transaction CSV
* `POST /api/uploads/processor` — Ingest payment processor settlement CSV
* `POST /api/uploads/ledger` — Ingest general ledger entries
* `POST /api/uploads/invoices` — Ingest billing invoices

### Batches (`/api/batches`)
* `GET /api/batches` — List reconciliation batches
* `POST /api/batches` — Initialize new close batch
* `GET /api/batches/:id` — Batch summary, progress, and matching metrics
* `POST /api/batches/:id/run` — Trigger end-to-end reconciliation pipeline

### Exceptions & Evidence (`/api/exceptions`)
* `GET /api/exceptions` — Filter exceptions (All, Critical, Review, Unresolved, Duplicates, Mismatches)
* `GET /api/exceptions/:id` — Exception detail, connected records (Invoice -> Processor -> Bank)
* `POST /api/exceptions/:id/investigate` — Trigger AI investigation agent
* `POST /api/exceptions/:id/approve` — Record human approval of AI recommendation
* `POST /api/exceptions/:id/reject` — Reject AI recommendation with required reasoning
* `POST /api/exceptions/:id/unresolve` — Mark transaction as unresolvable pending offline audit

### Cash Forecasting (`/api/cash-position`)
* `GET /api/cash-position` — Current real-time cash balance and source allocations
* `GET /api/cash-forecast` — 30-day forward forecast curve, inflows/outflows, safety buffer
* `POST /api/cash-forecast/run` — Recalculate forecast projection using latest reconciled data

### Evaluation & Audit (`/api/evaluation`, `/api/audit-logs`)
* `POST /api/evaluation/run` — Run ground-truth verification benchmark
* `GET /api/evaluation/:id` — Evaluation metrics (Precision, Recall, Auto-resolution Precision, False-resolution rate)
* `GET /api/audit-logs` — Immutable audit log of all decisions, AI investigations, and approvals
