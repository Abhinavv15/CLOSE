"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { api, ExceptionSummaryItem } from "@/lib/api";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  RotateCw,
  TrendingDown
} from "lucide-react";
import { PipelineStepHeader } from "@/components/layout/pipeline-step-header";

export default function ExceptionsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [counts, setCounts] = useState({
    total: 7,
    critical: 3,
    review: 4,
    unresolved: 2,
    auto_resolved: 4,
  });

  const [exceptions, setExceptions] = useState<any[]>([
    {
      id: "EX-102",
      type: "AMOUNT_MISMATCH",
      amount: 31800,
      difference: 50,
      confidence: 0.94,
      status: "REVIEW",
      created: "2026-09-04 10:32",
      summary: "Processor settlement is lower than invoice amount by ₹50 (1.5% fee variance).",
    },
    {
      id: "EX-108",
      type: "MISSING_RECORD",
      amount: 72400,
      difference: 72400,
      confidence: 0.38,
      status: "UNRESOLVED",
      created: "2026-09-04 10:32",
      summary: "Bank credit deposit with zero supporting invoice or processor record.",
    },
    {
      id: "EX-111",
      type: "DUPLICATE",
      amount: 25000,
      difference: 0,
      confidence: 0.97,
      status: "REVIEW",
      created: "2026-09-04 10:33",
      summary: "Identical transaction amount and customer reference posted twice within 4 days.",
    },
    {
      id: "EX-114",
      type: "TIMING_DIFFERENCE",
      amount: 140000,
      difference: 0,
      confidence: 0.92,
      status: "REVIEW",
      created: "2026-09-04 10:33",
      summary: "Settlement cleared 4 business days after invoice date.",
    },
    {
      id: "EX-119",
      type: "PARTIAL_SETTLEMENT",
      amount: 100000,
      difference: 40000,
      confidence: 0.88,
      status: "REVIEW",
      created: "2026-09-04 10:34",
      summary: "Split payment of ₹60,000 + ₹40,000 recorded against single ₹100,000 invoice.",
    },
    {
      id: "EX-122",
      type: "MISSING_RECORD",
      amount: 18500,
      difference: 18500,
      confidence: 0.42,
      status: "UNRESOLVED",
      created: "2026-09-04 10:34",
      summary: "Unrecognized merchant debit with insufficient supporting evidence.",
    },
    {
      id: "EX-125",
      type: "AMOUNT_MISMATCH",
      amount: 84000,
      difference: 240,
      confidence: 0.89,
      status: "REVIEW",
      created: "2026-09-04 10:35",
      summary: "Foreign exchange conversion variance between invoice and settlement.",
    },
  ]);

  useEffect(() => {
    async function loadExceptions() {
      try {
        const res = await api.getExceptions("batch_close_2026_09");
        if (res?.exceptions?.length) {
          setExceptions(res.exceptions);
          if (res.counts) setCounts(res.counts as any);
        }
      } catch {
        // Safe fallbacks
      } finally {
        setLoading(false);
      }
    }
    loadExceptions();
  }, []);

  const filterTabs = [
    { id: "ALL", label: `All (${exceptions.length})` },
    { id: "CRITICAL", label: `Critical (${exceptions.filter(e => e.type === "MISSING_RECORD" || e.confidence < 0.6).length})` },
    { id: "REVIEW", label: `Review (${exceptions.filter(e => e.status === "REVIEW").length})` },
    { id: "UNRESOLVED", label: `Unresolved (${exceptions.filter(e => e.status === "UNRESOLVED").length})` },
    { id: "AMOUNT_MISMATCH", label: "Amount Mismatch" },
    { id: "MISSING_RECORD", label: "Missing Record" },
    { id: "DUPLICATE", label: "Duplicates" },
    { id: "TIMING_DIFFERENCE", label: "Timing Diff" },
  ];

  const filteredExceptions = exceptions.filter((ex) => {
    // Tab filter
    if (activeFilter === "CRITICAL") {
      if (ex.type !== "MISSING_RECORD" && ex.confidence >= 0.6) return false;
    } else if (activeFilter === "REVIEW") {
      if (ex.status !== "REVIEW") return false;
    } else if (activeFilter === "UNRESOLVED") {
      if (ex.status !== "UNRESOLVED") return false;
    } else if (activeFilter !== "ALL") {
      if (ex.type !== activeFilter) return false;
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchId = (ex.id || "").toLowerCase().includes(q);
      const matchType = (ex.type || "").toLowerCase().includes(q);
      const matchSummary = (ex.summary || ex.reason || "").toLowerCase().includes(q);
      if (!matchId && !matchType && !matchSummary) return false;
    }

    return true;
  });

  return (
    <AppShell>
      <PipelineStepHeader 
        currentStep={3} 
        subtitle="AI agent investigates fee variances and discrepancies with bounded tools." 
      />

      {/* Header (Section 25) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Exception Center</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
              {exceptions.length} Anomalies Flagged
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Investigate discrepancies with AI evidence citations and human controller sign-off.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <Link
            href="/evaluation"
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Honest Evaluation Report</span>
          </Link>
        </div>
      </div>

      {/* 4 Category Metric Cards (Section 25) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-mono text-xs">
        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Total Exceptions</div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-tabular">{exceptions.length}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Across 127 records</div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Critical / Escalated</div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1 font-tabular">
            {exceptions.filter(e => e.type === "MISSING_RECORD" || e.confidence < 0.6).length}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Missing counterpart</div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Review Required</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 font-tabular">
            {exceptions.filter(e => e.status === "REVIEW").length}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">High AI confidence</div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Auto-Resolved</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 font-tabular">4</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">98.7% safety precision</div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search exception ID, type, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full w-full md:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors whitespace-nowrap shrink-0 ${
                activeFilter === tab.id
                  ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exceptions Table (Section 25) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[10px] uppercase text-zinc-400">
                <th className="py-3 px-4">Exception ID</th>
                <th className="py-3 px-4">Anomaly Type</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4 text-right">Difference</th>
                <th className="py-3 px-4 text-center">AI Confidence</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Investigation Summary</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredExceptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    No exceptions found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredExceptions.map((ex) => {
                  const isCritical = ex.type === "MISSING_RECORD" || ex.confidence < 0.6;
                  const isReview = ex.status === "REVIEW";

                  return (
                    <tr
                      key={ex.id}
                      className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        <Link href={`/exceptions/${ex.id}`} className="hover:underline flex items-center space-x-1">
                          <span>{ex.id}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            isCritical
                              ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                              : "bg-zinc-800 border-zinc-700 text-zinc-200"
                          }`}
                        >
                          {ex.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white font-tabular whitespace-nowrap">
                        ₹{Number(ex.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-tabular whitespace-nowrap">
                        <span className={ex.difference > 0 ? "text-amber-400 font-semibold" : "text-zinc-400"}>
                          ₹{Number(ex.difference).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            ex.confidence >= 0.85
                              ? "text-emerald-400"
                              : ex.confidence >= 0.6
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {(ex.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            ex.status === "APPROVED"
                              ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                              : ex.status === "REVIEW"
                              ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                              : "bg-rose-950/40 border-rose-800/60 text-rose-300"
                          }`}
                        >
                          {ex.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 max-w-sm truncate text-[11px]">
                        {ex.summary || ex.reason}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/exceptions/${ex.id}`}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors inline-flex items-center space-x-1"
                        >
                          <span>Investigate</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Showing {filteredExceptions.length} of {exceptions.length} exceptions</span>
          <span className="flex items-center space-x-1.5 text-zinc-400">
            <Sparkles className="w-3 h-3 text-zinc-300" />
            <span>AI Agent Evidence Citations Enabled</span>
          </span>
        </div>
      </div>
    </AppShell>
  );
}
