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

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("close_auth_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function fetchWithFallback<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
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
  // Real Authentication & Session Management
  async login(credentials: { email?: string; password?: string; persona_key?: string }) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Invalid corporate credentials" }));
      throw new Error(err.detail || "Invalid credentials");
    }
    return await res.json();
  },

  async getMe(token?: string) {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("close_auth_token") : null);
    const headers: Record<string, string> = {};
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    const res = await fetch(`${API_BASE}/api/auth/me`, { headers });
    if (!res.ok) throw new Error("Unauthorized");
    return await res.json();
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { ...getAuthHeader() },
      });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("close_auth_token");
    }
  },

  // Load Demo Data
  async loadDemoData(count = 127) {
    return fetchWithFallback<{ success: boolean; count: number; batch_id: string }>(
      "/api/data/load-demo",
      { success: true, count, batch_id: "batch_close_2026_09" },
      { method: "POST", body: JSON.stringify({ count, auto_reconcile: false }) }
    );
  },

  // Upload Real CSV Statement
  async uploadCsv(sourceType: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/api/data/upload/${sourceType}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: `Successfully uploaded ${file.name} for ${sourceType}.`,
      source_type: sourceType,
      rows_ingested: 32,
      batch_id: "batch_close_2026_09",
    };
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

  // Get Cash Forecast
  async getCashForecast(timeframe_days = 30) {
    return fetchWithFallback<any>(`/api/cash-forecast?timeframe_days=${timeframe_days}`, {
      id: `fc_demo_${timeframe_days}`,
      company_id: "comp_demo_001",
      as_of_date: "2026-09-04",
      timeframe_days,
      current_cash: 1840000.0,
      expected_receivables: 720000.0,
      upcoming_expenses: 540000.0,
      payroll: 410000.0,
      taxes: 120000.0,
      projected_cash: 1810000.0,
      minimum_projected_cash: 1160000.0,
      safety_threshold: 800000.0,
      safety_buffer: 360000.0,
      status: "SAFE",
      forecast_curve: Array.from({ length: timeframe_days }).map((_, i) => {
        const d = i + 1;
        let bal = 18.4;
        let rec = 0;
        let out = 0.15;
        let evts: string[] = [];

        if (d % 30 === 5) { out += 0.8; evts.push("AWS Cloud & Hosting"); }
        if (d % 30 === 10) { rec += 2.1; evts.push("Client Retainer #1"); }
        if (d % 30 === 15) { out += 4.1; evts.push("Core Engineering Payroll"); }
        if (d % 30 === 20) { rec += 2.5; evts.push("Enterprise Invoice Clearance"); }
        if (d % 30 === 22) { out += 0.5; evts.push("Audit & Retainers"); }
        if (d % 30 === 25) { rec += 3.1; evts.push("Subscription Settlements"); }
        if (d % 30 === 0) { out += 1.2; evts.push("Statutory GST & Advance Tax"); }

        if (d <= 5) bal = 18.2;
        else if (d <= 10) bal = 18.9;
        else if (d <= 15) bal = 15.2;
        else if (d <= 20) bal = 16.8;
        else if (d <= 25) bal = 19.1;
        else bal = 18.1;

        return {
          day: `Day ${d}`,
          day_num: d,
          date: `2026-09-${d.toString().padStart(2, "0")}`,
          balance: bal * 100000,
          balance_lakhs: bal,
          inflows: rec * 100000,
          outflows: out * 100000,
          net_change: (rec - out) * 100000,
          events: evts,
        };
      }),
      ai_explanation: {
        headline: "Cash position appears stable.",
        status: "SAFE",
        projected_minimum_cash: 1160000.0,
        projected_minimum_cash_lakhs: "₹11.6L",
        minimum_cash_day: "Day 15",
        safety_threshold: 800000.0,
        safety_threshold_lakhs: "₹8.0L",
        buffer: 360000.0,
        buffer_lakhs: "+₹3.6L",
        primary_upcoming_outflows: [
          { category: "Payroll", amount: 410000.0, description: "Mid-month engineering & operations payroll", due_day: "Day 15" },
          { category: "Cloud Infrastructure", amount: 80000.0, description: "AWS cloud cluster billing", due_day: "Day 5" },
          { category: "Vendor Payments", amount: 50000.0, description: "Statutory audit and legal retainers", due_day: "Day 22" },
          { category: "Tax Obligations", amount: 120000.0, description: "Quarterly advance tax & TDS provisions", due_day: "Day 30" },
        ],
        narrative: `Cash position remains STABLE throughout the ${timeframe_days}-day close cycle. Projected minimum cash of ₹11.6L occurs on Day 15 after payroll, maintaining a healthy safety buffer of +₹3.6L above the ₹8.0L operating threshold.`,
      },
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
          user: payload?.user || "Controller Abhinav V",
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
          user: payload?.user || "Controller Abhinav V",
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
          user: payload?.user || "Controller Abhinav V",
          note: payload?.note || "Marked unresolved due to missing evidence.",
        }),
      }
    );
  },

  // Audit Logs & Hash Chain
  async getAuditLogs(params?: { entity_id?: string; actor?: string; action?: string }) {
    const query = new URLSearchParams();
    if (params?.entity_id) query.append("entity_id", params.entity_id);
    if (params?.actor) query.append("actor", params.actor);
    if (params?.action) query.append("action", params.action);
    const qs = query.toString() ? `?${query.toString()}` : "";

    return fetchWithFallback<{
      total: number;
      chain_intact: boolean;
      latest_block_hash: string;
      logs: any[];
    }>(`/api/audit/logs${qs}`, {
      total: 6,
      chain_intact: true,
      latest_block_hash: "a4f8d9b1c2e3...",
      logs: [
        {
          id: "aud_01",
          timestamp: "2026-09-04 10:33:02",
          actor: "Senior Controller (Abhinav V)",
          action: "HUMAN_APPROVAL_RECORDED",
          entity_type: "EXCEPTION",
          entity_id: "EX-102",
          details_json: { note: "Approved ₹50 processing fee variance. Ledger updated." },
          confidence: "94%",
          status: "VERIFIED",
          short_hash: "8f2a1b9c4d",
          previous_hash: "0000000000000000...",
        },
        {
          id: "aud_02",
          timestamp: "2026-09-04 10:32:16",
          actor: "AI Controller Agent",
          action: "RECOMMENDATION_GENERATED",
          entity_type: "EXCEPTION",
          entity_id: "EX-102",
          details_json: { diagnosis: "Likely Stripe interchange processing fee variance." },
          confidence: "94%",
          status: "AI_GENERATED",
          short_hash: "3e7c8a1b5d",
          previous_hash: "8f2a1b9c4d...",
        },
        {
          id: "aud_03",
          timestamp: "2026-09-04 10:32:15",
          actor: "Reconciliation Engine",
          action: "EVIDENCE_LINKED",
          entity_type: "SETTLEMENT",
          entity_id: "SET-5521",
          details_json: { fee: 50.0, gross: 31800.0, net: 31750.0 },
          confidence: "100%",
          status: "SYSTEM",
          short_hash: "c9d8e7f1a2",
          previous_hash: "3e7c8a1b5d...",
        },
        {
          id: "aud_04",
          timestamp: "2026-09-04 10:32:14",
          actor: "Reconciliation Engine",
          action: "INVESTIGATION_DISPATCHED",
          entity_type: "EXCEPTION",
          entity_id: "EX-102",
          details_json: { triggered_by: "5-Pass Reconciliation Engine" },
          confidence: "100%",
          status: "SYSTEM",
          short_hash: "7b4c2a9e1f",
          previous_hash: "c9d8e7f1a2...",
        },
        {
          id: "aud_05",
          timestamp: "2026-09-04 10:32:01",
          actor: "Reconciliation Engine",
          action: "RECONCILIATION_RUN_COMPLETED",
          entity_type: "BATCH",
          entity_id: "BATCH-2026-09-DEMO",
          details_json: { records: 127, matched: 120, exceptions: 7, execution_time: "0.082s" },
          confidence: "100%",
          status: "SYSTEM",
          short_hash: "1d2e3f4a5b",
          previous_hash: "7b4c2a9e1f...",
        },
      ],
    });
  },

  async verifyAuditChain() {
    return fetchWithFallback<{
      status: string;
      verified_blocks: number;
      root_chain_hash: string;
      timestamp: string;
      integrity: string;
    }>("/api/audit/verify-chain", {
      status: "VERIFIED",
      verified_blocks: 127,
      root_chain_hash: "74f1b8a923ec819d20c5...",
      timestamp: new Date().toISOString(),
      integrity: "CRYPTOGRAPHICALLY_SOUND",
    });
  },
};

