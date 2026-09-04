# CLOSE — Hackathon Demo Guide

Follow these steps for a live walkthrough:

1. **Launch**: Start both frontend and backend (`npm run dev` in `apps/web` and `uvicorn app.main:app` in `services/finance-engine`).
2. **Landing Page (`/`)**: Note the monochrome aesthetic, real-time counter cards, and the system philosophy:
   > "Our deterministic engine handles what can be proven. Our AI handles what requires reasoning. When neither has enough evidence, CLOSE refuses to decide."
3. **One-Click Demo (`/dashboard`)**: Click **"Load Demo Dataset"** (127 records across Bank, Processor, General Ledger, and Invoices).
4. **Run Reconciliation**: Click **"RUN CLOSE"**; watch real multi-stage progression: Ingestion → Normalization → Matching → Exception Triage → Cash Projection.
5. **Inspect Exception Center (`/exceptions`)**: Open `EX-102` (₹50 processor fee discrepancy).
   - Review the 3-tier Evidence Room (Invoice ₹31,800 → Processor ₹31,750 → Bank ₹31,750).
   - Trigger AI Investigation to observe the step-by-step reasoning timeline and 94% confidence score.
   - Click **Approve Resolution** and verify audit log update.
6. **Inspect Unresolved Record (`/exceptions`)**: Open `EX-108` (₹72,400 missing invoice transaction).
   - Observe CLOSE honestly refusing to guess, marking it **"Unable to resolve — human investigation required"**.
7. **Controller Evaluation (`/evaluation`)**: Inspect precision (96.6%), recall (96.5%), and the Honest Exception breakdown.
8. **Cash Position & Forecast (`/cash-position`)**: Review the 30-day forecast curve, safety buffer (₹8.0L), and AI narrative commentary.
