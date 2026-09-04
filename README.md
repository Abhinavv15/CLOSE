# Build "CLOSE" — AI Finance Controller

You are a senior full-stack engineer, AI engineer, product designer, and UI/UX engineer.

Build a complete, production-quality hackathon application called:

# CLOSE

### AI Finance Controller

Tagline:

> Reconcile the books. Explain the exceptions. Know your cash position.

The application must be a genuinely functional full-stack product, not a static frontend prototype.

The core objective is:

> Given a batch of synthetic financial records from multiple sources, automatically reconcile the records, investigate ambiguous transactions using AI, calculate measurable accuracy, produce an honest exception list, and generate a forward cash-position forecast.

The system must process at least 50+ records and preferably support 100–500 synthetic records smoothly.

Do NOT build a generic AI chatbot.

Do NOT make the LLM responsible for basic arithmetic or deterministic reconciliation.

The system must combine deterministic financial logic + AI investigation + evidence + confidence scoring + human approval.

---

# 1. PRODUCT VISION

CLOSE should behave like an AI junior finance controller.

A finance user should be able to:

1. Create/select a company.
2. Upload financial data from multiple sources.
3. Run a reconciliation batch.
4. See matching progress in real time.
5. See matched, AI-matched, review, duplicate, and unresolved records.
6. Open any exception.
7. See all supporting evidence.
8. Ask the AI controller to investigate the exception.
9. Receive a structured explanation.
10. See confidence and recommended action.
11. Approve/reject the AI recommendation.
12. View an audit trail.
13. View current cash position.
14. View a 30-day forward cash forecast.
15. See the system's measured performance.
16. See exactly which records the AI could not resolve.

The most important product principle:

> The AI must never pretend to know something that the available evidence does not support.

If evidence is insufficient, the system must explicitly say:

> Unable to resolve — human review required.

---

# 2. CORE DIFFERENTIATOR

The application should communicate this idea throughout the product:

> "Our deterministic engine handles what can be proven. Our AI handles what requires reasoning. When neither has enough evidence, CLOSE refuses to decide."

The product should emphasize:

* Throughput
* Match rate
* Precision
* Recall
* Auto-resolution precision
* Exception rate
* Evidence
* Confidence
* Human approval
* Auditability

Do not hide failures.

The unresolved exception list is a feature, not a weakness.

---

# 3. TECH STACK

Use the following stack.

## FRONTEND

* Next.js latest stable
* React latest compatible version
* TypeScript
* App Router
* Tailwind CSS v4
* Aceternity UI
* shadcn/ui where appropriate
* Motion / motion-react for animations
* Recharts for financial charts
* TanStack Query for server state
* React Hook Form
* Zod
* Lucide React icons

Use Next.js App Router.

Do not use an outdated Pages Router architecture.

---

# 4. UI SYSTEM

The visual direction is extremely important.

Use a:

# WHITE + BLACK + GREY

color system.

Do NOT use a colorful SaaS aesthetic.

Avoid:

* purple gradients
* blue-heavy dashboards
* neon colors
* excessive glassmorphism
* excessive shadows
* rainbow gradients
* generic AI aesthetics

Primary colors:

* White
* Near-black
* Black
* Zinc
* Neutral grey
* Light grey
* Dark grey

Use color sparingly for semantic states only:

* Green = successful/reconciled
* Amber = review
* Red = unresolved/critical

The overall application should feel like a premium modern fintech/control system.

Think:

* Linear
* Vercel
* Stripe
* Ramp
* Mercury
* modern financial terminals

but do NOT copy their designs.

Create an original identity for CLOSE.

---

# 5. ACETERNITY UI

Use Aceternity UI heavily but intelligently.

Do not randomly add animations everywhere.

Use appropriate components such as:

* Spotlight
* Background Beams
* Moving Border
* Bento Grid
* Floating Dock
* Sidebar
* Animated Tabs
* Text Generate Effect
* Text Reveal
* Timeline
* Tracing Beam
* File Upload
* Stateful Button
* Multi Step Loader
* Hover Border Gradient
* Layout Grid
* Sticky Scroll Reveal
* Following Pointer
* Wobble Card
* Focus Cards
* Background Grid/Dot effects
* Hero sections where appropriate

Use the current Aceternity approach and Motion for React rather than old Framer Motion patterns.

Reference:

https://ui.aceternity.com/

Follow current component installation conventions.

Do not install every Aceternity component.

Only install components that actually improve the interface.

---

# 6. ANIMATION PHILOSOPHY

Use modern 2026-style microinteractions.

Animations should communicate state and hierarchy.

Use:

* subtle page transitions
* staggered entrance animations
* number counting animations
* table row reveal
* progress animations
* smooth sidebar transitions
* animated status changes
* animated confidence meters
* hover interactions
* command palette transitions
* smooth modal transitions
* chart drawing animations
* reconciliation processing animation
* AI investigation timeline
* subtle cursor interactions

Do NOT make the financial dashboard look like a gaming website.

Animations must remain professional.

Respect:

`prefers-reduced-motion`.

---

# 7. FRONTEND PAGES

Create these routes:

```text
/
 /login
 /dashboard
 /batches
 /batches/[batchId]
 /reconciliation
 /exceptions
 /exceptions/[exceptionId]
 /cash-position
 /audit-log
 /evaluation
 /settings
```

---

# 8. LANDING PAGE

Create a premium landing page.

Hero:

# CLOSE

### AI Finance Controller

> Reconcile financial records, investigate exceptions, and forecast cash — with evidence behind every decision.

Primary CTA:

`Run a Demo`

Secondary CTA:

`View Evaluation`

Hero visual:

Show an animated finance-control interface.

Use subtle Aceternity Spotlight / Background Grid / Moving Border effects.

Below hero show:

```text
127
Records Processed

94.5%
Match Rate

98.7%
Auto-resolution Precision

7
Unresolved Exceptions
```

Do not make these numbers fake-looking marketing claims.

Clearly label demo/synthetic data where appropriate.

---

# 9. AUTHENTICATION

Implement authentication.

Use Supabase Auth or another clean managed authentication solution.

Support:

* login
* logout
* protected application routes
* session handling

Do not spend excessive time creating a custom authentication system.

---

# 10. MAIN DASHBOARD

Dashboard should be the command center.

Header:

```text
CLOSE
AI Finance Controller

September 2026 Close
```

Show KPI cards:

```text
Records Processed
127

Match Rate
94.5%

Resolved
116

Exceptions
7

Current Cash
₹18.4L

30-Day Forecast
₹18.1L
```

Use animated number transitions.

Below this:

## Reconciliation Health

Show:

```text
Bank ↔ Processor       96%
Processor ↔ Ledger     92%
Ledger ↔ Invoice       98%
```

Use elegant progress indicators.

---

# 11. DASHBOARD EXCEPTION SUMMARY

Show:

```text
Exceptions Requiring Attention

3 Critical
4 Review

EX-102
₹50 settlement difference
94% confidence

EX-108
Missing invoice
38% confidence

EX-111
Potential duplicate
97% confidence
```

Each row should be clickable.

---

# 12. CASH POSITION WIDGET

Show:

```text
Current Cash
₹18.4L

Expected Receivables
+₹7.2L

Upcoming Expenses
-₹5.4L

Taxes
-₹1.2L

Projected 30-Day Cash
₹18.1L
```

Include a Recharts line/area visualization.

Keep it monochrome.

Use semantic status indicators only.

---

# 13. DATA INGESTION

Create a dedicated upload page.

The user should be able to upload:

```text
Bank Transactions
Payment Processor Transactions
General Ledger
Invoices
```

Accept CSV.

Optional JSON support.

Use Aceternity File Upload.

After upload:

```text
Uploading
↓
Validating
↓
Normalizing
↓
Importing
↓
Ready
```

Show errors if the schema is invalid.

Do not silently accept malformed data.

---

# 14. SYNTHETIC DATA GENERATOR

Create a development/demo data generator.

It should generate realistic synthetic financial data.

Support:

```text
50 records
100 records
250 records
500 records
1000 records
```

Generate:

### Bank transactions

Fields:

```text
id
date
description
amount
currency
reference
type
```

### Processor settlements

Fields:

```text
id
settlement_date
processor
transaction_id
gross_amount
fee
net_amount
currency
status
reference
```

### Ledger entries

Fields:

```text
id
date
account
description
debit
credit
reference
```

### Invoices

Fields:

```text
id
invoice_number
customer
invoice_date
due_date
amount
currency
status
```

---

# 15. ADVERSARIAL DATA

The generator must intentionally introduce difficult cases.

Create known ground truth.

Include:

### Exact matches

Approximately 50–60%.

### Description variations

Examples:

```text
STRIPE PAYOUT 82931

Stripe Inc Settlement #82931
```

### Date differences

Example:

```text
Invoice: Sep 1
Settlement: Sep 3
```

### Processing fees

Example:

```text
Invoice: ₹31,800
Processor gross: ₹31,800
Fee: ₹50
Bank received: ₹31,750
```

### Partial settlements

Example:

```text
Invoice: ₹100,000

Settlement A: ₹60,000
Settlement B: ₹40,000
```

### Duplicates

Create duplicate transactions.

### Missing records

Create records existing in one source but not another.

### Amount mismatches

Create legitimate and suspicious differences.

### Unknown transactions

Create transactions for which no supporting evidence exists.

### Timing differences

Allow configurable settlement delays.

---

# 16. GROUND TRUTH

This is critical.

Every synthetic record must have hidden ground-truth metadata.

For example:

```text
ground_truth_match_id
ground_truth_status
ground_truth_exception_type
ground_truth_resolution
```

This data should NOT be exposed in the normal UI.

It exists only for evaluation.

This allows the system to calculate real metrics.

---

# 17. RECONCILIATION ENGINE

Build the reconciliation engine in Python.

Do NOT use the LLM for deterministic matching.

Pipeline:

```text
Normalize
↓
Exact Match
↓
Reference Match
↓
Amount Match
↓
Date Tolerance
↓
Fuzzy Description Match
↓
Duplicate Detection
↓
Candidate Ranking
↓
AI Investigation if required
↓
Confidence
↓
Resolve / Review / Unresolved
```

---

# 18. MATCHING RULES

Implement deterministic scoring.

Consider:

### Amount

Exact amount:

High score.

Small difference:

Possible fee.

Large difference:

Low score.

### Reference

Matching transaction/reference IDs:

Very high score.

### Date

Same day:

High score.

1–3 days:

Possible settlement delay.

Large difference:

Lower score.

### Description

Use fuzzy matching.

Do not rely solely on semantic embeddings.

---

# 19. DUPLICATE DETECTION

Detect:

* exact duplicates
* same amount + same date
* same reference
* near-identical descriptions

Show:

```text
Potential duplicate detected

Transaction A
₹25,000

Transaction B
₹25,000

Similarity: 98%
```

---

# 20. AI FINANCE CONTROLLER

Create an AI agent service.

Use Python.

Use an LLM API with:

* structured outputs
* tool calling
* strict schemas

The AI should investigate only ambiguous records.

Do NOT send the entire database to the LLM.

---

# 21. AI TOOLS

Implement tools such as:

```text
search_bank_transactions
search_processor_transactions
search_ledger_entries
search_invoices
compare_transactions
find_duplicates
get_transaction_history
calculate_difference
calculate_cash_position
```

The agent can call these tools to gather evidence.

---

# 22. AI INVESTIGATION FLOW

Example:

```text
Exception
↓
AI receives exception
↓
AI searches supporting records
↓
AI compares amounts
↓
AI checks dates
↓
AI checks references
↓
AI checks processor fees
↓
AI evaluates evidence
↓
AI returns structured decision
```

---

# 23. AI OUTPUT SCHEMA

The AI must return structured JSON similar to:

```json
{
  "classification": "PROCESSOR_FEE",
  "confidence": 0.94,
  "status": "REVIEW",
  "explanation": "The processor settlement is lower than the invoice by ₹50, while the transaction reference and dates align.",
  "recommended_action": "Classify ₹50 as processor fee after approval.",
  "evidence": [
    {
      "type": "invoice",
      "id": "INV-1022"
    },
    {
      "type": "processor_transaction",
      "id": "SET-5521"
    },
    {
      "type": "bank_transaction",
      "id": "BANK-88421"
    }
  ]
}
```

Validate the response with Pydantic.

Never trust raw LLM output.

---

# 24. CONFIDENCE SYSTEM

Implement:

```text
95–100%
AUTO-RESOLVE

85–94%
RECOMMEND + HUMAN APPROVAL

60–84%
REVIEW

<60%
UNRESOLVED
```

These thresholds must be configurable.

Do not automatically modify financial records based only on an LLM response.

---

# 25. EXCEPTION CENTER

Create a dedicated exception dashboard.

Filters:

```text
All
Critical
Review
Unresolved
Resolved
Duplicates
Amount Mismatch
Missing Record
Timing Difference
```

Each exception should show:

```text
Exception ID
Type
Amount
Difference
Confidence
Status
Created
```

Use elegant table interactions.

---

# 26. EXCEPTION DETAIL PAGE

This should be one of the best-designed pages.

Layout:

```text
EX-102
Settlement Difference

Expected
₹31,800

Actual
₹31,750

Difference
₹50
```

Then:

# Evidence

Show connected records:

```text
Invoice INV-1022
₹31,800
       │
       ▼
Processor Settlement #5521
₹31,750
       │
       ▼
Bank Transaction #B88421
₹31,750
```

Use a visual evidence relationship.

---

# 27. AI INVESTIGATION PANEL

Show an animated investigation timeline:

```text
Investigating exception...

✓ Retrieved invoice
✓ Retrieved processor settlement
✓ Retrieved bank transaction
✓ Compared amounts
✓ Checked settlement timing
✓ Evaluated processor fee
✓ Generated recommendation
```

Use Aceternity Timeline / tracing-style visuals where appropriate.

Then show:

```text
AI CONCLUSION

Likely processor fee

Confidence
94%

Recommended Action
Review and classify ₹50 as processor fee.
```

---

# 28. EVIDENCE-FIRST DESIGN

Every AI claim must be linked to evidence.

Show:

```text
Evidence used:
3 records

Invoice
INV-1022

Processor settlement
SET-5521

Bank transaction
BANK-88421
```

If there is insufficient evidence:

```text
INSUFFICIENT EVIDENCE

CLOSE could not find enough supporting records.

Recommended action:
Human investigation required.
```

---

# 29. HUMAN APPROVAL

Buttons:

```text
Approve Resolution
Reject
Mark Unresolved
```

When approving:

Require optional reason.

Record:

```text
user
timestamp
decision
reason
AI recommendation
```

---

# 30. AUDIT LOG

Create a complete audit page.

Example:

```text
10:32:14
AI investigation started
EX-102

10:32:15
Invoice INV-1022 retrieved

10:32:15
Settlement SET-5521 retrieved

10:32:16
AI recommendation generated

Confidence: 94%

10:33:02
Human approval recorded
```

Audit logs must be append-only from the application's perspective.

---

# 31. RECONCILIATION RESULTS PAGE

Show every transaction.

Columns:

```text
Transaction
Source
Amount
Matched With
Difference
Method
Confidence
Status
```

Methods:

```text
EXACT
RULE
FUZZY
AI
HUMAN
```

Use badges.

---

# 32. PROCESSING EXPERIENCE

When the user clicks:

# RUN CLOSE

show a real processing flow.

Steps:

```text
Ingesting
↓
Normalizing
↓
Matching
↓
Detecting duplicates
↓
Investigating exceptions
↓
Calculating metrics
↓
Calculating cash position
↓
Generating close report
```

Do not fake progress.

Progress must correspond to actual backend processing.

---

# 33. BACKEND

Use:

```text
Python
FastAPI
Pydantic
SQLAlchemy
PostgreSQL
Pandas
NumPy
scikit-learn where useful
```

Use FastAPI for the main API and internal AI/data services.

Keep the architecture modular.

---

# 34. DATABASE

Use PostgreSQL.

Suggested tables:

```text
users
companies
bank_accounts

bank_transactions
processor_transactions
ledger_entries
invoices

reconciliation_batches
reconciliation_matches

exceptions
exception_evidence

cash_forecasts

audit_logs

evaluation_runs
evaluation_results
```

Use proper foreign keys.

Use indexes on:

```text
company_id
transaction_date
reference
amount
batch_id
status
```

Use transactions for important database operations.

---

# 35. FILE STORAGE

Use:

```text
Supabase Storage
```

or S3-compatible storage.

Uploaded files should not be stored directly in PostgreSQL.

Store:

```text
file path
filename
type
batch id
upload timestamp
user
```

in PostgreSQL.

---

# 36. API STRUCTURE

Implement APIs similar to:

## Auth

```text
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

## Companies

```text
GET /api/companies
POST /api/companies
GET /api/companies/:id
```

## Batches

```text
GET /api/batches
POST /api/batches
GET /api/batches/:id
POST /api/batches/:id/run
GET /api/batches/:id/status
```

## Upload

```text
POST /api/uploads/bank
POST /api/uploads/processor
POST /api/uploads/ledger
POST /api/uploads/invoices
```

## Reconciliation

```text
GET /api/reconciliation/:batchId
GET /api/reconciliation/:batchId/results
```

## Exceptions

```text
GET /api/exceptions
GET /api/exceptions/:id
POST /api/exceptions/:id/investigate
POST /api/exceptions/:id/approve
POST /api/exceptions/:id/reject
POST /api/exceptions/:id/unresolve
```

## Cash

```text
GET /api/cash-position
GET /api/cash-forecast
POST /api/cash-forecast/run
```

## Evaluation

```text
POST /api/evaluation/run
GET /api/evaluation/:id
GET /api/evaluation/:id/results
```

## Audit

```text
GET /api/audit-logs
```

---

# 37. CASH FORECASTING

Build a deterministic cash forecasting engine first.

Formula:

```text
Current Cash
+
Expected Receivables
-
Expected Expenses
-
Payroll
-
Taxes
-
Vendor Payments
=
Projected Cash
```

Support:

```text
7 days
14 days
30 days
60 days
90 days
```

Primary demo should use 30 days.

---

# 38. CASH FORECAST AI EXPLANATION

The AI can explain the forecast.

Example:

```text
Cash position appears stable.

Projected minimum cash:
₹11.6L

Safety threshold:
₹8L

Buffer:
₹3.6L

Primary upcoming outflows:
Payroll
AWS
Vendor payments
Tax obligations
```

Do not allow AI to calculate the actual numbers.

Backend calculates the numbers.

AI explains them.

---

# 39. EVALUATION ENGINE

This is a major feature.

Create a page:

# Controller Evaluation

Show:

```text
Records Processed
127

Correct Matches
112

Incorrect Matches
4

Unresolved
7

Precision
96.6%

Recall
96.5%

Auto-resolution Precision
98.7%

False Resolution Rate
1.1%

Average Processing Time
1.4s
```

These values must be calculated from ground truth.

Never hardcode them.

---

# 40. METRICS

Calculate at minimum:

```text
accuracy
precision
recall
F1
match rate
exception rate
auto-resolution precision
false resolution rate
throughput
processing time
```

For financial systems, emphasize precision and false-resolution rate.

A wrong automatic financial resolution is more dangerous than an unresolved record.

---

# 41. HONEST EXCEPTION REPORT

Create a section:

# What CLOSE Could Not Resolve

Example:

```text
7 exceptions

3 missing source records
2 ambiguous transactions
1 suspected duplicate
1 insufficient evidence
```

Allow clicking into every exception.

This should be prominent.

---

# 42. DEMO MODE

Create a one-click demo.

Button:

# Load Demo Dataset

This should generate or load:

```text
127 records
4 sources
```

with known ground truth.

Then:

```text
Run Close
```

should process the dataset.

This is essential for the hackathon.

Judges should not need to manually prepare CSV files.

---

# 43. API ERROR HANDLING

Implement proper errors.

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CSV_SCHEMA",
    "message": "The uploaded bank file is missing the required 'amount' column."
  }
}
```

Frontend should show clean human-readable errors.

Never expose stack traces to users.

---

# 44. SECURITY

Implement basic production-grade security.

Requirements:

* environment variables
* no API keys in frontend
* server-side LLM calls
* authentication
* authorization
* input validation
* file type validation
* file size limits
* SQL injection protection
* rate limiting where appropriate
* audit logging
* no direct LLM database writes

The LLM must never receive secrets.

---

# 45. AI SAFETY

The AI must:

1. Never invent transactions.
2. Never invent invoices.
3. Never invent evidence.
4. Never directly modify financial records.
5. Never approve its own recommendations.
6. Explicitly report insufficient evidence.
7. Return structured output.
8. Include evidence IDs.
9. Include confidence.
10. Allow human override.

---

# 46. RESPONSIVE DESIGN

The entire frontend must work on:

```text
Desktop
Laptop
Tablet
Mobile
```

Primary experience:

Desktop finance dashboard.

Mobile should still support:

* dashboard
* exception review
* cash position
* batch status

Tables should become horizontally scrollable or responsive cards.

---

# 47. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible labels
* sufficient contrast
* reduced-motion support
* accessible dialogs
* accessible tables

Do not sacrifice usability for visual effects.

---

# 48. DESIGN DETAILS

Typography:

Use a modern clean sans-serif.

Prefer:

```text
Inter
Geist
```

or another professional UI font.

Use:

* large typography for major metrics
* compact typography for financial tables
* monospaced typography for transaction IDs and numerical audit data where appropriate

Numbers should be easy to scan.

Use tabular numerals where appropriate.

---

# 49. NAVIGATION

Desktop:

```text
CLOSE

Overview
Dashboard

Operations
Batches
Reconciliation
Exceptions

Finance
Cash Position

Control
Evaluation
Audit Log

Settings
```

Use an Aceternity animated/sidebar component where appropriate.

Sidebar should collapse elegantly.

---

# 50. COMMAND PALETTE

Implement a command palette.

Keyboard:

```text
⌘ K
```

Actions:

```text
Search transaction
Search invoice
Open exceptions
Run reconciliation
View cash position
Open evaluation
```

This should feel like a professional internal finance tool.

---

# 51. EMPTY STATES

Every page needs a useful empty state.

Example:

```text
No reconciliation batches yet.

Upload your financial sources or load the demo dataset to begin.

[ Load Demo Dataset ]
[ Upload Data ]
```

Do not leave blank screens.

---

# 52. LOADING STATES

Use skeleton loaders.

For AI investigation:

Use an elegant animated state:

```text
Investigating evidence
Analyzing relationships
Checking settlement history
Evaluating confidence
```

Do not fake AI reasoning.

The displayed status should correspond to actual operations.

---

# 53. DATABASE SEED

Create a seed command:

```text
npm run seed
```

or an appropriate Python command.

Seed:

* demo company
* demo user
* 127 financial records
* known ground truth
* realistic exceptions

---

# 54. PROJECT STRUCTURE

Use a clean repository:

```text
close-finance-controller/

├── apps/
│   └── web/
│
├── services/
│   └── finance-engine/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
│
├── data/
│   ├── synthetic/
│   └── fixtures/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── evaluation.md
│   └── demo.md
│
├── scripts/
│
├── docker/
│
├── .env.example
├── README.md
└── docker-compose.yml
```

If a monorepo structure creates unnecessary complexity, use a simpler repository, but keep frontend, backend, data-processing, and documentation clearly separated.

---

# 55. GIT BRANCH STRATEGY

This is extremely important.

DO NOT build everything directly on main.

Create:

```text
main
develop
```

Then feature branches.

Use:

```text
feature/project-setup
feature/database
feature/synthetic-data
feature/reconciliation-engine
feature/ai-controller
feature/exception-center
feature/cash-forecast
feature/evaluation
feature/frontend-dashboard
feature/frontend-reconciliation
feature/frontend-exceptions
feature/frontend-cash
feature/auth
feature/audit-log
feature/testing
feature/deployment
feature/final-polish
```

---

# 56. BRANCH WORKFLOW

Start:

```text
main
  ↓
develop
```

Every feature branch starts from `develop`.

Example:

```text
develop
  ↓
feature/database
```

Finish:

```text
feature/database
  ↓
Pull Request
  ↓
develop
```

Do not merge directly into main during normal development.

After a complete stable milestone:

```text
develop
  ↓
main
```

Create meaningful commits.

Examples:

```text
feat: initialize Next.js application
feat: add PostgreSQL schema
feat: add synthetic finance data generator
feat: implement deterministic reconciliation
feat: add AI exception investigator
feat: add exception evidence view
feat: add cash forecasting engine
feat: add evaluation metrics
feat: add finance dashboard
fix: handle missing processor references
test: add reconciliation edge cases
docs: add architecture documentation
```

---

# 57. BRANCH IMPLEMENTATION ORDER

Follow this exact order.

## Branch 1

```text
feature/project-setup
```

Implement:

* repository
* Next.js
* TypeScript
* Tailwind
* Aceternity
* shadcn
* Motion
* ESLint
* Prettier
* environment configuration

Verify frontend runs.

---

## Branch 2

```text
feature/database
```

Implement:

* PostgreSQL
* schema
* migrations
* SQLAlchemy
* indexes
* relationships
* seed structure

Verify database connectivity.

---

## Branch 3

```text
feature/synthetic-data
```

Implement:

* synthetic transaction generator
* ground truth
* adversarial cases
* 127-record demo dataset

Add tests.

---

## Branch 4

```text
feature/reconciliation-engine
```

Implement:

* normalization
* exact matching
* reference matching
* amount matching
* date tolerance
* fuzzy matching
* duplicate detection
* candidate ranking

Add unit tests.

---

## Branch 5

```text
feature/ai-controller
```

Implement:

* AI service
* structured outputs
* tool calling
* evidence retrieval
* exception investigation
* confidence scoring

Add mocked tests so the application can run without the LLM API during local testing.

---

## Branch 6

```text
feature/exception-center
```

Implement:

* exception API
* exception table
* detail page
* evidence
* AI investigation
* approval
* rejection
* audit entries

---

## Branch 7

```text
feature/cash-forecast
```

Implement:

* cash position calculation
* receivables
* expenses
* taxes
* forecast engine
* 30-day forecast
* API

---

## Branch 8

```text
feature/evaluation
```

Implement:

* ground-truth evaluation
* precision
* recall
* F1
* match rate
* exception rate
* auto-resolution precision
* false resolution rate
* throughput
* processing time

---

## Branch 9

```text
feature/frontend-dashboard
```

Implement:

* sidebar
* dashboard
* KPI cards
* charts
* exception summary
* cash position
* processing status

Use Aceternity components carefully.

---

## Branch 10

```text
feature/frontend-reconciliation
```

Implement:

* batch page
* reconciliation table
* filters
* status badges
* transaction detail
* processing progress

---

## Branch 11

```text
feature/frontend-exceptions
```

Implement:

* exception center
* exception detail
* evidence visualization
* AI investigation timeline
* confidence visualization
* approval/rejection UI

---

## Branch 12

```text
feature/frontend-cash
```

Implement:

* cash position page
* forecast graph
* inflows/outflows
* minimum balance
* safety threshold
* AI explanation

---

## Branch 13

```text
feature/auth
```

Implement:

* authentication
* protected routes
* session handling
* user/company permissions

---

## Branch 14

```text
feature/audit-log
```

Implement:

* audit timeline
* filters
* entity links
* action history

---

## Branch 15

```text
feature/testing
```

Implement:

* frontend tests
* API tests
* reconciliation tests
* AI schema tests
* evaluation tests
* edge-case tests

---

## Branch 16

```text
feature/deployment
```

Implement:

* Docker
* production environment variables
* deployment configuration
* health checks
* production build

---

## Branch 17

```text
feature/final-polish
```

Implement:

* animations
* responsive design
* accessibility
* loading states
* empty states
* error states
* performance optimization
* final visual polish

---

# 58. TESTING

Do not skip testing.

Test:

### Reconciliation

```text
exact match
fuzzy match
fee difference
duplicate
missing transaction
partial settlement
date difference
unknown transaction
```

### AI

Test malformed responses.

Test:

```text
missing evidence
invalid confidence
invalid classification
hallucinated evidence
```

### API

Test:

```text
authentication
upload
batch creation
reconciliation
exception approval
forecast
evaluation
```

---

# 59. MOCK AI MODE

The application must work even if the AI API key is missing.

Implement:

```text
AI_MODE=mock
```

When mock mode is active:

* return deterministic AI decisions
* simulate investigation steps
* use known ground truth
* allow the entire demo to run offline

When:

```text
AI_MODE=live
```

use the real LLM API.

This is essential for hackathon reliability.

---

# 60. OBSERVABILITY

Add basic structured logging.

Log:

```text
batch_id
transaction_id
exception_id
operation
duration
status
error
```

Never log:

* API keys
* passwords
* sensitive secrets

---

# 61. PERFORMANCE

The reconciliation engine must process 100+ records quickly.

Avoid:

```text
O(n²)
```

matching wherever possible.

Use indexing/dictionaries for:

* references
* amounts
* dates

Use candidate filtering before fuzzy matching.

The AI should only receive ambiguous records.

Do not call the LLM once per transaction.

---

# 62. API DOCUMENTATION

FastAPI should expose API documentation.

Document:

* request schemas
* response schemas
* error codes
* authentication
* batch processing
* reconciliation
* exceptions
* cash forecasting
* evaluation

Also create:

```text
docs/api.md
```

---

# 63. ENVIRONMENT VARIABLES

Create:

```text
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

LLM_API_KEY=

AI_MODE=mock

STORAGE_BUCKET=

REDIS_URL=

NEXT_PUBLIC_API_URL=
```

Never commit `.env`.

Provide:

```text
.env.example
```

---

# 64. README

Create a professional README containing:

# CLOSE — AI Finance Controller

## Problem

Explain the finance verification problem.

## Solution

Explain the controller architecture.

## Features

List:

* multi-source reconciliation
* AI exception investigation
* evidence
* confidence
* human approval
* cash forecasting
* evaluation

## Architecture

Include a Mermaid diagram.

## Tech Stack

Include all technologies.

## Local Setup

Give exact commands.

## Environment Variables

Explain them.

## Demo

Explain how to load the demo dataset.

## Evaluation

Explain the metrics.

## Git Workflow

Explain branches.

## Deployment

Explain deployment.

---

# 65. ARCHITECTURE DOCUMENT

Create:

```text
docs/architecture.md
```

Explain:

```text
Next.js
 ↓
FastAPI
 ↓
PostgreSQL
 ↓
Reconciliation Engine
 ↓
AI Controller
 ↓
Evaluation
```

Include Mermaid diagrams.

---

# 66. API CONTRACTS

Before implementing frontend API calls, define response schemas.

Example:

```json
{
  "batchId": "batch_001",
  "status": "completed",
  "recordsProcessed": 127,
  "matched": 116,
  "exceptions": 7,
  "matchRate": 0.945
}
```

Use TypeScript types generated or maintained from the API contract.

Do not use `any` unnecessarily.

---

# 67. FINANCIAL DATA RULES

Never use floating point for money calculations if avoidable.

Use:

```text
Decimal
```

or database numeric/decimal fields.

Never calculate financial values using careless binary floating point.

Always store:

```text
amount
currency
```

together.

---

# 68. CURRENCY

Initial MVP:

```text
INR
```

Optional:

```text
USD
EUR
GBP
```

If multi-currency is implemented, use explicit exchange rates.

Do not silently convert currencies.

---

# 69. UI COPY

Use concise finance terminology.

Avoid:

> "Our magical AI found this amazing insight!"

Instead:

> "AI recommendation"

> "Evidence"

> "Confidence"

> "Requires review"

> "Unable to resolve"

> "Auto-resolved"

The application should feel trustworthy.

---

# 70. IMPORTANT: NO FAKE AI

Do not create a fake chatbot where responses are hardcoded.

The AI must actually:

* retrieve evidence
* reason over evidence
* return structured results
* cite record IDs
* produce confidence
* create an audit event

Mock mode is acceptable only as a fallback/demo mode.

---

# 71. IMPORTANT: NO FAKE METRICS

Do not hardcode:

```text
94.5%
98.7%
```

Those numbers must be generated from the actual evaluation engine.

The UI should read them from the backend.

---

# 72. IMPORTANT: NO FAKE PROCESSING

Do not show:

```text
Processing 20%
Processing 40%
Processing 60%
```

with arbitrary timers.

Progress should correspond to actual processing stages.

---

# 73. FINAL DEMO FLOW

The finished application should support this exact hackathon demo:

### Step 1

Open:

```text
/
```

Show CLOSE landing page.

### Step 2

Click:

```text
Run Demo
```

### Step 3

Load:

```text
127 records
4 sources
```

### Step 4

Click:

```text
RUN CLOSE
```

### Step 5

Show processing:

```text
Ingesting
Normalizing
Matching
Investigating
Evaluating
Forecasting
```

### Step 6

Show:

```text
127 records
116 resolved
7 exceptions
94.5% match rate
```

### Step 7

Open an amount mismatch.

Show:

```text
Invoice: ₹31,800
Processor: ₹31,750
Bank: ₹31,750
```

### Step 8

Run AI investigation.

Show evidence.

Show:

```text
Likely processor fee
94% confidence
Human approval required
```

### Step 9

Approve.

Show audit log.

### Step 10

Open an unresolved transaction.

Show:

```text
₹72,400

No supporting invoice found.
No processor settlement found.
No ledger match found.

Unable to resolve.
Human investigation required.
```

### Step 11

Open Evaluation.

Show real metrics.

### Step 12

Open Cash Position.

Show:

```text
Current Cash
₹18.4L

30-Day Forecast
₹18.1L

Minimum Balance
₹11.6L

Safety Threshold
₹8L

STATUS: SAFE
```

End with:

> CLOSE doesn't guess. It reconciles what it can prove and escalates what it can't.

---

# 74. DEVELOPMENT RULES

Follow these rules strictly:

1. Build incrementally.
2. Do not create placeholder pages that remain unfinished.
3. Do not use fake API responses in production code.
4. Use TypeScript strictly.
5. Avoid `any`.
6. Validate all API input.
7. Validate all AI output.
8. Use proper database relationships.
9. Use Decimal for financial calculations.
10. Keep secrets server-side.
11. Add tests for core financial logic.
12. Keep AI reasoning separate from deterministic calculations.
13. Do not overuse animations.
14. Keep the UI monochrome.
15. Make the application responsive.
16. Make the application accessible.
17. Keep commits small and meaningful.
18. Use feature branches.
19. Merge feature branches into `develop`.
20. Merge `develop` into `main` only after testing.
21. Do not rewrite or force-push shared branches.
22. Document important architecture decisions.

---

# 75. IMPLEMENTATION PRIORITY

If time becomes limited, prioritize in this order:

## P0 — MUST HAVE

* PostgreSQL
* synthetic data
* multi-source reconciliation
* deterministic matching
* exception engine
* AI investigation
* evidence
* confidence
* evaluation metrics
* dashboard
* demo mode

## P1 — VERY IMPORTANT

* cash forecast
* human approval
* audit trail
* responsive UI
* loading states
* error handling

## P2 — POLISH

* command palette
* advanced animations
* advanced filters
* accessibility improvements
* performance optimization
* Docker
* deployment

Never sacrifice P0 functionality for visual polish.

---

# 76. FINAL QUALITY BAR

Before considering the project complete, verify:

### Functionality

[ ] User can login.

[ ] User can load demo data.

[ ] User can upload CSVs.

[ ] Data enters PostgreSQL.

[ ] Reconciliation actually runs.

[ ] Matches are calculated.

[ ] Exceptions are generated.

[ ] AI can investigate an exception.

[ ] Evidence is displayed.

[ ] Confidence is displayed.

[ ] Human approval works.

[ ] Audit logs are created.

[ ] Cash forecast works.

[ ] Evaluation metrics are calculated from ground truth.

[ ] Unresolved exceptions are visible.

---

### Technical

[ ] No hardcoded production metrics.

[ ] No fake processing progress.

[ ] No API keys in frontend.

[ ] No raw LLM output trusted.

[ ] Financial calculations use Decimal/Numeric.

[ ] Database constraints exist.

[ ] API validation exists.

[ ] Error handling exists.

[ ] Tests exist.

[ ] README exists.

[ ] Architecture documentation exists.

---

### UI

[ ] White/black/grey visual identity.

[ ] Premium fintech appearance.

[ ] Aceternity UI components used appropriately.

[ ] Modern Motion animations.

[ ] Responsive.

[ ] Accessible.

[ ] Fast.

[ ] No unnecessary gradients.

[ ] No excessive glassmorphism.

[ ] No excessive animations.

[ ] Tables are readable.

[ ] Financial numbers are easy to scan.

---

# 77. STARTING INSTRUCTION

Do NOT immediately attempt to build the entire application in one giant change.

Start with:

```text
feature/project-setup
```

First inspect the repository.

Then:

1. Initialize the project.
2. Set up Next.js + TypeScript.
3. Configure Tailwind CSS v4.
4. Configure Aceternity UI.
5. Configure Motion.
6. Configure shadcn/ui.
7. Create the base design system.
8. Create the application shell.
9. Create sidebar/navigation.
10. Create placeholder routes with correct layouts.
11. Add `.env.example`.
12. Add ESLint/formatting.
13. Add README foundation.
14. Run the application.
15. Verify the build.
16. Commit changes to the feature branch.

Then stop and prepare for:

```text
feature/database
```

Do not proceed to the next branch until the current branch builds successfully.

At every branch:

1. Implement the feature.
2. Test it.
3. Run lint.
4. Run type checking.
5. Run build.
6. Fix errors.
7. Commit.
8. Explain what was implemented.
9. Provide the branch name.
10. Only then move to the next branch.

The final result must be a complete, functional, deployable AI Finance Controller rather than a visual prototype.
