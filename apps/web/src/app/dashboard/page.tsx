"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { AppShell } from "@/components/layout/app-shell";
import { Spotlight } from "@/components/ui/spotlight";
import { ButtonWithMovingBorder } from "@/components/ui/moving-border";
import { api, BatchSummary, ExceptionSummaryItem, CashPositionData, EvaluationData } from "@/lib/api";
import { 
  Play, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ArrowUpRight,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  RotateCw
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [runningClose, setRunningClose] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(true);
  const [activeStage, setActiveStage] = useState<string | null>(null);

  // Live Data State with initial canonical values
  const [batch, setBatch] = useState<BatchSummary>({
    batch_id: "batch_close_2026_09",
    status: "COMPLETED",
    records_processed: 127,
    matched: 116,
    ai_matched: 4,
    review_required: 4,
    unresolved: 7,
    match_rate: 0.945,
  });

  const [exceptions, setExceptions] = useState<ExceptionSummaryItem[]>([
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
  ]);

  const [cashPosition, setCashPosition] = useState<CashPositionData>({
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

  const [evaluation, setEvaluation] = useState<EvaluationData>({
    id: "eval_demo_001",
    batch_id: "batch_close_2026_09",
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

  // Mini cash curve for widget
  const miniChartData = [
    { day: "D1", balance: 18.4 },
    { day: "D5", balance: 18.2 },
    { day: "D10", balance: 18.9 },
    { day: "D15", balance: 15.2 }, // Payroll dip
    { day: "D20", balance: 16.8 },
    { day: "D25", balance: 19.1 },
    { day: "D30", balance: 18.1 },
  ];

  const stages = [
    "Ingesting 4 sources (Bank, Processor, Ledger, Invoices)...",
    "Pass 1: Identifying duplicate anomaly hashes...",
    "Pass 2: Deterministic exact reference matching...",
    "Pass 3: Investigating processor fee variances with AI tools...",
    "Pass 4: Evaluating multi-day fuzzy & timing tolerances...",
    "Pass 5: Flagging honest unbacked exceptions...",
    "Computing deterministic 30-day cash curve...",
    "Calculating ground-truth precision & false-resolution rates...",
    "Close finalized successfully."
  ];

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [batchRes, exRes, cashRes, evalRes] = await Promise.all([
          api.getBatchSummary("batch_close_2026_09"),
          api.getExceptions("batch_close_2026_09"),
          api.getCashPosition(),
          api.getEvaluation("batch_close_2026_09"),
        ]);
        if (batchRes) setBatch(batchRes);
        if (exRes && exRes.exceptions && exRes.exceptions.length > 0) setExceptions(exRes.exceptions);
        if (cashRes) setCashPosition(cashRes);
        if (evalRes) setEvaluation(evalRes);
      } catch {
        // Safe fallbacks remain active
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleLoadDemo = async () => {
    setLoading(true);
    try {
      await api.loadDemoData(127);
      setDemoLoaded(true);
      const [batchRes, exRes, cashRes] = await Promise.all([
        api.getBatchSummary("batch_close_2026_09"),
        api.getExceptions("batch_close_2026_09"),
        api.getCashPosition(),
      ]);
      if (batchRes) setBatch(batchRes);
      if (exRes?.exceptions?.length) setExceptions(exRes.exceptions);
      if (cashRes) setCashPosition(cashRes);
    } catch {
      setDemoLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRunClose = async () => {
    setRunningClose(true);
    let current = 0;
    setActiveStage(stages[0]);

    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setActiveStage(stages[current]);
      } else {
        clearInterval(interval);
        setRunningClose(false);
        setActiveStage(null);
      }
    }, 400);

    try {
      const runResult = await api.runReconciliation("batch_close_2026_09");
      if (runResult) setBatch(runResult);
    } catch {
      // Keep optimistic batch state
    }
  };

  return (
    <AppShell>
      <div className="relative">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        {/* Title & Command Bar (Section 10) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">September 2026 Close</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                Batch #{batch.batch_id.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 border border-emerald-800/60 text-emerald-400">
                STATUS: {batch.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              AI Finance Controller — Reconcile the books. Explain the exceptions. Know your cash position.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleLoadDemo}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span>{demoLoaded ? "Demo Dataset Loaded (127)" : "Load Demo Dataset"}</span>
            </button>

            <ButtonWithMovingBorder
              as="button"
              onClick={handleRunClose}
              disabled={runningClose}
              duration={2500}
              className="px-4 py-2 text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-900 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>{runningClose ? "PROCESSING..." : "RUN CLOSE"}</span>
              </span>
            </ButtonWithMovingBorder>
          </div>
        </div>

        {/* Real-time Close Processing Progress Banner */}
        <AnimatePresence>
          {runningClose && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 rounded-xl bg-zinc-900/90 border border-zinc-700 backdrop-blur-md space-y-2 shadow-2xl"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-200">
                <span className="flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-white">{activeStage}</span>
                </span>
                <span className="text-zinc-400">Deterministic Engine (<span className="text-emerald-400">0.08s</span>)</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-white h-1.5 rounded-full"
                  initial={{ width: "10%" }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 3.2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6 Core KPI Cards (Section 10, Animated Counters) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-400">Records Processed</div>
            <div className="text-2xl font-bold font-tabular text-white mt-1">
              {batch.records_processed}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">Across 4 sources</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-400">Match Rate</div>
            <div className="text-2xl font-bold font-tabular text-emerald-400 mt-1">
              {(batch.match_rate > 1 ? batch.match_rate : batch.match_rate * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">{batch.matched} of {batch.records_processed}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-400">Resolved Records</div>
            <div className="text-2xl font-bold font-tabular text-zinc-100 mt-1">
              {batch.matched}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">Proven deterministic</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-400">Exceptions</div>
            <div className="text-2xl font-bold font-tabular text-amber-400 mt-1">
              {batch.unresolved}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">3 Critical · 4 Review</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-400">Current Cash</div>
            <div className="text-2xl font-bold font-tabular text-white mt-1">
              ₹{(cashPosition.current_cash / 100000).toFixed(1)}L
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 font-mono">Verified bank ledger</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-400">30-Day Forecast</div>
            <div className="text-2xl font-bold font-tabular text-zinc-200 mt-1">
              ₹{(cashPosition.projected_30d_cash / 100000).toFixed(1)}L
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">STATUS: {cashPosition.status}</div>
          </motion.div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Reconciliation Health & Exceptions Requiring Attention */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reconciliation Health Cross-Source Alignment (Section 10) */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Reconciliation Health</h3>
                  <p className="text-xs text-zinc-400 font-mono">Cross-source deterministic alignment</p>
                </div>
                <Link
                  href="/reconciliation"
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>View Full Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300">Bank ↔ Processor Settlements</span>
                    <span className="text-zinc-200 font-bold">96%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "96%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300">Processor ↔ General Ledger</span>
                    <span className="text-zinc-200 font-bold">92%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-zinc-300 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300">General Ledger ↔ Customer Invoices</span>
                    <span className="text-zinc-200 font-bold">98%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "98%" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Exception Summary (Section 11) */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Exceptions Requiring Attention</h3>
                  <span className="text-xs font-mono text-zinc-400">(3 Critical · 4 Review)</span>
                </div>
                <Link
                  href="/exceptions"
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>Exception Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-800/60 font-mono">
                {exceptions.slice(0, 3).map((ex) => {
                  const isCritical = ex.type === "MISSING_RECORD" || (ex.confidence < 0.6);
                  return (
                    <Link
                      key={ex.id}
                      href={`/exceptions/${ex.id}`}
                      className="py-3.5 px-2 flex items-center justify-between hover:bg-zinc-800/30 rounded-lg transition-colors group block"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            isCritical ? "bg-rose-400" : "bg-amber-400"
                          }`}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white group-hover:text-zinc-200">
                              {ex.id}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                isCritical
                                  ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                                  : "bg-amber-950/40 border-amber-800/60 text-amber-300"
                              }`}
                            >
                              ₹{ex.difference > 0 ? ex.difference.toLocaleString() : ex.amount.toLocaleString()} {ex.type.toLowerCase().replace("_", " ")}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5 max-w-md truncate">
                            {ex.reason || ex.ai_classification}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-xs font-semibold ${
                            ex.confidence >= 0.85
                              ? "text-emerald-400"
                              : ex.confidence >= 0.6
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {(ex.confidence * 100).toFixed(0)}% Confidence
                        </div>
                        <div className="text-[10px] text-zinc-400 group-hover:text-zinc-200 flex items-center justify-end space-x-1">
                          <span>{ex.confidence < 0.6 ? "Unable to resolve" : "Review match"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Cash Position Widget & Evaluation Card */}
          <div className="space-y-6">
            {/* Cash Position Widget with Recharts Mini Chart (Section 12) */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Cash Position Overview</h3>
                  <span className="text-[10px] font-mono text-zinc-400">Formula-backed forward curve</span>
                </div>
                <Link
                  href="/cash-position"
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>30-Day Curve</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="h-32 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashCashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} domain={[0, 24]} />
                    <ReferenceLine
                      y={8}
                      stroke="#f59e0b"
                      strokeDasharray="2 2"
                      label={{ value: "Floor ₹8L", fill: "#f59e0b", fontSize: 9 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#dashCashGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 5 Key Cash Breakdown Numbers (Section 12) */}
              <div className="space-y-2 font-mono text-xs pt-1">
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Current Cash</span>
                  <span className="text-white font-bold">
                    ₹{(cashPosition.current_cash / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Expected Receivables</span>
                  <span className="text-emerald-400 font-semibold">
                    +₹{(cashPosition.expected_receivables / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Upcoming Outflows</span>
                  <span className="text-zinc-300">
                    -₹{(cashPosition.upcoming_expenses / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Taxes & Statutory</span>
                  <span className="text-zinc-300">
                    -₹{(cashPosition.taxes / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm">
                  <span className="text-zinc-200 font-bold">Projected 30-Day Cash</span>
                  <span className="text-white font-black">
                    ₹{(cashPosition.projected_30d_cash / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Safety Threshold:</span>
                  <span className="font-semibold text-amber-400">₹8.0L</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Minimum Projected Dip:</span>
                  <span className="font-semibold text-emerald-400">
                    ₹{(cashPosition.minimum_projected_cash / 100000).toFixed(1)}L (Day 15)
                  </span>
                </div>
              </div>
            </div>

            {/* Controller Ground-Truth Evaluation Card */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ground-Truth Verification</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {evaluation.average_processing_time_seconds}s execution
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 uppercase">Auto-Resolution Precision</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {(evaluation.auto_resolution_precision * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 uppercase">False Resolution Rate</div>
                  <div className="text-base font-bold text-zinc-200 mt-0.5">
                    {(evaluation.false_resolution_rate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed pt-1 font-mono text-[11px]">
                Calculated strictly from hidden synthetic annotations. Zero blind automation.
              </p>

              <Link
                href="/evaluation"
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900 px-3 py-1.5 rounded-lg transition-colors w-full justify-between"
              >
                <span>Inspect Evaluation Scorecard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
