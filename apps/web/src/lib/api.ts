/**
 * API client for CLOSE AI Finance Controller.
 * Provides resilient requests to the FastAPI backend with instant fallback data
 * so the frontend operates smoothly in both offline demo and live backend modes.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BatchSummary {
  batch_id: string;
  status: string;
  records_processed: number;
  matched: number;
  ai_matched: number;
  review_required: number;
  unresolved: number;
  match_rate: number;
}

export interface ExceptionSummaryItem {
  id: string;
  type: string;
  amount: number;
  difference: number;
  confidence: number;
  status: string;
  severity?: string;
  reason?: string;
  ai_classification?: string;
}

export interface ReconciliationMatchItem {
  id: string;
  bank_tx_id?: string;
  description: string;
  source: string;
  amount: number;
  matched_with: string;
  difference: number;
  method: string;
  confidence: number;
  status: string;
  created_at?: string;
}

export interface CashPositionData {
  company_id: string;
  current_cash: number;
  expected_receivables: number;
  open_invoice_count: number;
  upcoming_expenses: number;
  payroll: number;
  taxes: number;
  projected_30d_cash: number;
  minimum_projected_cash: number;
  safety_threshold: number;
  safety_buffer: number;
  status: string;
  currency: string;
}

export interface EvaluationData {
  id: string;
  batch_id: string;
  records_processed: number;
  correct_matches: number;
  incorrect_matches: number;
  unresolved_count: number;
  precision: number;
  recall: number;
  f1_score: number;
  match_rate: number;
  auto_resolution_precision: number;
  false_resolution_rate: number;
  average_processing_time_seconds: number;
  honest_breakdown: {
    total_unresolved: number;
    missing_source_records: number;
    ambiguous_transactions: number;
    suspected_duplicates: number;
    insufficient_evidence: number;
  };
}

async function fetchWithFallback<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      return fallback;
    }
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const api = {
  // Load Demo Data
  async loadDemoData(count = 127) {
    return fetchWithFallback<{ success: boolean; count: number; batch_id: string }>(
      "/api/data/load-demo",
      { success: true, count, batch_id: "batch_close_2026_09" },
      { method: "POST", body: JSON.stringify({ count, auto_reconcile: false }) }
    );
  },

  // Run Reconciliation Close
  async runReconciliation(batchId = "batch_close_2026_09") {
    return fetchWithFallback<BatchSummary>(
      "/api/reconciliation/run",
      {
        batch_id: batchId,
        status: "COMPLETED",
        records_processed: 127,
        matched: 116,
        ai_matched: 4,
        review_required: 4,
        unresolved: 7,
        match_rate: 0.945,
      },
      { method: "POST", body: JSON.stringify({ batch_id: batchId, auto_investigate: true }) }
    );
  },

  // Get Batch Summary
  async getBatchSummary(batchId = "batch_close_2026_09"): Promise<BatchSummary> {
    return fetchWithFallback<BatchSummary>(`/api/reconciliation/${batchId}`, {
      batch_id: batchId,
      status: "COMPLETED",
      records_processed: 127,
      matched: 116,
      ai_matched: 4,
      review_required: 4,
      unresolved: 7,
      match_rate: 0.945,
    });
  },

  // Get Reconciliation Results Table
  async getReconciliationResults(
    batchId = "batch_close_2026_09",
    method?: string,
    status?: string
  ): Promise<{ batch_id: string; count: number; results: ReconciliationMatchItem[] }> {
    const params = new URLSearchParams();
    if (method && method !== "ALL") params.append("method", method);
    if (status && status !== "ALL") params.append("status", status);
    const query = params.toString() ? `?${params.toString()}` : "";

    return fetchWithFallback(
      `/api/reconciliation/${batchId}/results${query}`,
      {
        batch_id: batchId,
        count: 7,
        results: [
          {
            id: "match_demo_001",
            bank_tx_id: "bt_demo_001",
            description: "STRIPE PAYOUT #82931",
            source: "Bank",
            amount: 124500.0,
            matched_with: "Stripe #SET-9912 (INV-1014)",
            difference: 0.0,
            method: "EXACT",
            confidence: 1.0,
            status: "RECONCILED",
          },
          {
            id: "match_demo_002",
            bank_tx_id: "bt_demo_002",
            description: "RAZORPAY SETTLEMENT #5521",
            source: "Bank",
            amount: 4950.0,
            matched_with: "Razorpay #SET-5521 (INV-1022)",
            difference: 50.0,
            method: "AI",
            confidence: 0.94,
            status: "REVIEW",
          },
          {
            id: "match_demo_003",
            bank_tx_id: "bt_demo_003",
            description: "NEFT INFLOW AWS REBATE",
            source: "Bank",
            amount: 14200.0,
            matched_with: "General Ledger #GL-4401",
            difference: 0.0,
            method: "FUZZY",
            confidence: 0.91,
            status: "RECONCILED",
          },
          {
            id: "match_demo_004",
            bank_tx_id: "bt_demo_004",
            description: "OFFICE LEASE SEP 2026 CHQ #4091",
            source: "Bank",
            amount: 65000.0,
            matched_with: "General Ledger #GL-8802",
            difference: 0.0,
            method: "RULE",
            confidence: 0.98,
            status: "RECONCILED",
          },
          {
            id: "match_demo_005",
            bank_tx_id: "bt_demo_005",
            description: "RTGS DEPOSIT UNBACKED",
            source: "Bank",
            amount: 72400.0,
            matched_with: "— No corroborating evidence —",
            difference: 72400.0,
            method: "HUMAN",
            confidence: 0.38,
            status: "UNRESOLVED",
          },
          {
            id: "match_demo_006",
            bank_tx_id: "bt_demo_006",
            description: "STRIPE DUPLICATE SETTLEMENT",
            source: "Bank",
            amount: 25000.0,
            matched_with: "Stripe #SET-9092",
            difference: 0.0,
            method: "RULE",
            confidence: 0.97,
            status: "REVIEW",
          },
          {
            id: "match_demo_007",
            bank_tx_id: "bt_demo_007",
            description: "ENTERPRISE SUBSCRIPTION BHART FINSERV",
            source: "Bank",
            amount: 100000.0,
            matched_with: "Invoice INV-1088 (Split settlement)",
            difference: 0.0,
            method: "AI",
            confidence: 0.96,
            status: "RECONCILED",
          },
        ],
      }
    );
  },
  async getExceptions(batchId = "batch_close_2026_09"): Promise<{
    exceptions: ExceptionSummaryItem[];
    counts: { total: number; review: number; critical: number; auto_resolved: number };
  }> {
    return fetchWithFallback(
      `/api/exceptions?batch_id=${batchId}`,
      {
        counts: { total: 7, review: 4, critical: 3, auto_resolved: 4 },
        exceptions: [
          {
            id: "EX-102",
            type: "AMOUNT_MISMATCH",
            amount: 4950,
            difference: 50,
            confidence: 0.94,
            status: "REVIEW",
            reason: "Invoice INV-1022 vs Processor SET-5521 · Likely processor fee",
            ai_classification: "PROCESSOR_FEE_VARIANCE",
          },
          {
            id: "EX-108",
            type: "MISSING_RECORD",
            amount: 72400,
            difference: 72400,
            confidence: 0.38,
            status: "UNRESOLVED",
            reason: "Bank deposit with no corroborating processor or invoice record",
            ai_classification: "UNBACKED_DEPOSIT",
          },
          {
            id: "EX-111",
            type: "DUPLICATE",
            amount: 25000,
            difference: 0,
            confidence: 0.97,
            status: "REVIEW",
            reason: "Duplicate transaction ID #TXN-9092 on same settlement date",
            ai_classification: "DUPLICATE_SUSPECTED",
          },
        ],
      }
    );
  },

  // Get Cash Position
  async getCashPosition(): Promise<CashPositionData> {
    return fetchWithFallback<CashPositionData>("/api/cash-position", {
      company_id: "comp_demo_001",
      current_cash: 1840000.0,
      expected_receivables: 720000.0,
      open_invoice_count: 14,
      upcoming_expenses: 540000.0,
      payroll: 410000.0,
      taxes: 120000.0,
      projected_30d_cash: 1810000.0,
      minimum_projected_cash: 1160000.0,
      safety_threshold: 800000.0,
      safety_buffer: 360000.0,
      status: "SAFE",
      currency: "INR",
    });
  },

  // Get Evaluation Scorecard
  async getEvaluation(batchId = "batch_close_2026_09"): Promise<EvaluationData> {
    return fetchWithFallback<EvaluationData>(`/api/evaluation?batch_id=${batchId}`, {
      id: "eval_demo_001",
      batch_id: batchId,
      records_processed: 127,
      correct_matches: 112,
      incorrect_matches: 4,
      unresolved_count: 7,
      precision: 0.966,
      recall: 0.965,
      f1_score: 0.9655,
      match_rate: 0.945,
      auto_resolution_precision: 0.987,
      false_resolution_rate: 0.011,
      average_processing_time_seconds: 1.4,
      honest_breakdown: {
        total_unresolved: 7,
        missing_source_records: 3,
        ambiguous_transactions: 2,
        suspected_duplicates: 1,
        insufficient_evidence: 1,
      },
    });
  },

  // Get Exception Detail
  async getExceptionDetail(exceptionId: string) {
    return fetchWithFallback<any>(`/api/exceptions/${exceptionId}`, {
      exception_id: exceptionId,
      batch_id: "batch_close_2026_09",
      type: exceptionId === "EX-108" ? "MISSING_RECORD" : "AMOUNT_MISMATCH",
      status: exceptionId === "EX-108" ? "UNRESOLVED" : "REVIEW",
      amounts: {
        expected: exceptionId === "EX-108" ? 0.0 : 31800.0,
        actual: exceptionId === "EX-108" ? 72400.0 : 31750.0,
        difference: exceptionId === "EX-108" ? 72400.0 : 50.0,
      },
      ai_investigation: {
        classification: exceptionId === "EX-108" ? "UNBACKED_DEPOSIT" : "PROCESSOR_FEE_VARIANCE",
        confidence: exceptionId === "EX-108" ? 0.38 : 0.94,
        explanation: exceptionId === "EX-108"
          ? "Unrecognized bank credit deposit with zero corroborating invoice or settlement record."
          : "Discrepancy of ₹50 matches standard 1.5% - 2.0% gateway settlement fee.",
        recommended_action: exceptionId === "EX-108"
          ? "Escalate to human finance controller for manual statement review."
          : "Approve ₹50 as gateway transaction processing fee.",
      },
      evidence: [
        {
          source: "Bank Transaction",
          id: "BT-88421",
          amount: exceptionId === "EX-108" ? 72400.0 : 31750.0,
          date: "2026-09-04",
          description: exceptionId === "EX-108" ? "RTGS DEPOSIT UNKNOWN ORIGIN" : "STRIPE PAYOUT #5521",
        },
        ...(exceptionId !== "EX-108" ? [
          {
            source: "Processor Settlement",
            id: "SET-5521",
            amount: 31750.0,
            fee: 50.0,
            date: "2026-09-04",
            description: "Stripe payout settlement",
          },
          {
            source: "Customer Invoice",
            id: "INV-1022",
            amount: 31800.0,
            date: "2026-09-01",
            description: "Enterprise subscription billing",
          }
        ] : [])
      ],
      resolution: {
        resolved_by: null,
        resolution_note: null,
        resolved_at: null,
      },
    });
  },

  // Approve Exception
  async approveException(exceptionId: string, payload?: { user?: string; note?: string }) {
    return fetchWithFallback<{ success: boolean; status: string }>(
      `/api/exceptions/${exceptionId}/approve`,
      { success: true, status: "APPROVED" },
      {
        method: "POST",
        body: JSON.stringify({
          user: payload?.user || "Controller Abhinav",
          note: payload?.note || "Approved as processor fee variance.",
        }),
      }
    );
  },

  // Reject Exception
  async rejectException(exceptionId: string, payload?: { user?: string; note?: string }) {
    return fetchWithFallback<{ success: boolean; status: string }>(
      `/api/exceptions/${exceptionId}/reject`,
      { success: true, status: "REJECTED" },
      {
        method: "POST",
        body: JSON.stringify({
          user: payload?.user || "Controller Abhinav",
          note: payload?.note || "Rejected resolution recommendation.",
        }),
      }
    );
  },

  // Mark Unresolved
  async unresolveException(exceptionId: string, payload?: { user?: string; note?: string }) {
    return fetchWithFallback<{ success: boolean; status: string }>(
      `/api/exceptions/${exceptionId}/unresolve`,
      { success: true, status: "UNRESOLVED" },
      {
        method: "POST",
        body: JSON.stringify({
          user: payload?.user || "Controller Abhinav",
          note: payload?.note || "Marked unresolved due to missing evidence.",
        }),
      }
    );
  },
};
