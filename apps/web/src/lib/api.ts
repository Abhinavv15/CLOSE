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

  // Get Exceptions
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
};
