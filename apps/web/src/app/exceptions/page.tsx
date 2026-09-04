"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";

export default function ExceptionsPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const exceptions = [
    {
      id: "EX-102",
      type: "AMOUNT_MISMATCH",
      amount: "₹31,800",
      difference: "₹50 (Processor Fee)",
      confidence: 0.94,
      status: "REVIEW",
      created: "2026-09-04 10:32",
      summary: "Processor settlement is lower than invoice amount by ₹50."
    },
    {
      id: "EX-108",
      type: "MISSING_RECORD",
      amount: "₹72,400",
      difference: "₹72,400",
      confidence: 0.38,
      status: "UNRESOLVED",
      created: "2026-09-04 10:32",
      summary: "Bank credit with no supporting invoice, processor settlement, or ledger entry."
    },
    {
      id: "EX-111",
      type: "DUPLICATE",
      amount: "₹25,000",
      difference: "₹0",
      confidence: 0.97,
      status: "REVIEW",
      created: "2026-09-04 10:33",
      summary: "Identical transaction amount and customer reference posted twice."
    },
    {
      id: "EX-114",
      type: "TIMING_DIFFERENCE",
      amount: "₹1,40,000",
      difference: "₹0",
      confidence: 0.92,
      status: "REVIEW",
      created: "2026-09-04 10:33",
      summary: "Settlement cleared 3 business days after invoice creation date."
    },
    {
      id: "EX-119",
      type: "PARTIAL_SETTLEMENT",
      amount: "₹1,00,000",
      difference: "₹40,000 Remaining",
      confidence: 0.88,
      status: "REVIEW",
      created: "2026-09-04 10:34",
      summary: "Partial payment of ₹60,000 recorded against ₹100,000 invoice."
    },
    {
      id: "EX-122",
      type: "MISSING_RECORD",
      amount: "₹18,500",
      difference: "₹18,500",
      confidence: 0.42,
      status: "UNRESOLVED",
      created: "2026-09-04 10:34",
      summary: "Unrecognized merchant debit with insufficient evidence."
    },
    {
      id: "EX-125",
      type: "AMOUNT_MISMATCH",
      amount: "₹84,000",
      difference: "₹240",
      confidence: 0.89,
      status: "REVIEW",
      created: "2026-09-04 10:35",
      summary: "Foreign exchange conversion variance between invoice and settlement."
    }
  ];

  const filterTabs = [
    { id: "ALL", label: "All (7)" },
    { id: "CRITICAL", label: "Critical (3)" },
    { id: "REVIEW", label: "Review (4)" },
    { id: "UNRESOLVED", label: "Unresolved (2)" },
    { id: "AMOUNT_MISMATCH", label: "Amount Mismatch" },
    { id: "MISSING_RECORD", label: "Missing Record" },
    { id: "DUPLICATE", label: "Duplicates" },
    { id: "TIMING_DIFFERENCE", label: "Timing Difference" },
  ];

  const filtered = exceptions.filter((ex) => {
    if (activeFilter === "CRITICAL") return ex.status === "UNRESOLVED" || ex.difference.includes("72,400");
    if (activeFilter === "REVIEW") return ex.status === "REVIEW";
    if (activeFilter === "UNRESOLVED") return ex.status === "UNRESOLVED";
    if (activeFilter !== "ALL" && ex.type !== activeFilter) return false;
    if (search && !ex.id.toLowerCase().includes(search.toLowerCase()) && !ex.summary.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Exception Center</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 border border-amber-800/60 text-amber-300">
              7 Exceptions Pending
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Investigate discrepancies, review AI-retrieved evidence, and approve or reject resolutions.
          </p>
        </div>
      </div>

      {/* Filter Tabs (Section 25) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-white text-zinc-950 font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search exceptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-zinc-600 font-mono"
          />
        </div>
      </div>

      {/* Exceptions Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Exception ID</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Difference</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filtered.map((ex) => (
              <tr 
                key={ex.id}
                onClick={() => window.location.href = `/exceptions/${ex.id}`}
                className="hover:bg-zinc-800/40 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4">
                  <span className="font-bold text-white group-hover:text-zinc-100">{ex.id}</span>
                  <div className="text-[11px] text-zinc-400 truncate max-w-[200px] mt-0.5">{ex.summary}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {ex.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-tabular font-semibold text-white">{ex.amount}</td>
                <td className="py-3 px-4 font-tabular text-amber-400">{ex.difference}</td>
                <td className="py-3 px-4 font-tabular">
                  <span className={ex.confidence >= 0.90 ? "text-emerald-400" : ex.confidence >= 0.60 ? "text-amber-400" : "text-rose-400 font-bold"}>
                    {(ex.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      ex.status === "REVIEW"
                        ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                        : "bg-rose-950/40 border-rose-800/60 text-rose-300"
                    }`}
                  >
                    {ex.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-zinc-400 text-[11px]">{ex.created}</td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center space-x-1 text-xs text-zinc-400 group-hover:text-white">
                    <span>Investigate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
