"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  GitMerge, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function ReconciliationPage() {
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const sampleRecords = [
    {
      id: "TXN-8821",
      source: "Bank",
      description: "STRIPE PAYOUT 82931",
      amount: "₹1,24,500",
      matchedWith: "SET-9912 (Stripe Payout #82931)",
      difference: "₹0",
      method: "EXACT",
      confidence: 1.0,
      status: "RECONCILED",
    },
    {
      id: "TXN-8822",
      source: "Processor",
      description: "Settlement #5521 INV-1022",
      amount: "₹31,750",
      matchedWith: "INV-1022 (₹31,800)",
      difference: "-₹50 (Fee)",
      method: "AI",
      confidence: 0.94,
      status: "REVIEW",
    },
    {
      id: "TXN-8823",
      source: "Bank",
      description: "NEFT INFLOW AWS REFUND",
      amount: "₹14,200",
      matchedWith: "GL-4401 (AWS Credit Memo)",
      difference: "₹0",
      method: "FUZZY",
      confidence: 0.91,
      status: "RECONCILED",
    },
    {
      id: "TXN-8824",
      source: "Ledger",
      description: "Office Lease Sep 2026",
      amount: "₹65,000",
      matchedWith: "BANK-9102 (Lease Chq #4091)",
      difference: "₹0",
      method: "RULE",
      confidence: 0.98,
      status: "RECONCILED",
    },
    {
      id: "TXN-8825",
      source: "Bank",
      description: "DIRECT RTGS UNKNOWN ORIGIN",
      amount: "₹72,400",
      matchedWith: "— No matching evidence —",
      difference: "₹72,400",
      method: "HUMAN",
      confidence: 0.38,
      status: "UNRESOLVED",
    },
    {
      id: "TXN-8826",
      source: "Processor",
      description: "DUPLICATE #TXN-9092",
      amount: "₹25,000",
      matchedWith: "SET-9092 (Duplicate match 98%)",
      difference: "₹0",
      method: "RULE",
      confidence: 0.97,
      status: "REVIEW",
    },
  ];

  const filteredRecords = sampleRecords.filter((r) => {
    if (filterMethod !== "ALL" && r.method !== filterMethod) return false;
    if (searchQuery && !r.description.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Reconciliation Matrix</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Deterministic matching results, fee tolerances, fuzzy linkages, and AI investigations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-zinc-400">Batch #CLOSE-2026-09:</span>
          <span className="text-xs font-mono font-bold text-emerald-400">94.5% Match Rate</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "EXACT", "RULE", "FUZZY", "AI", "HUMAN"].map((method) => (
            <button
              key={method}
              onClick={() => setFilterMethod(method)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filterMethod === method
                  ? "bg-white text-zinc-950 font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-zinc-600 font-mono"
          />
        </div>
      </div>

      {/* Results Table (Section 31) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Transaction</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Matched With</th>
              <th className="py-3 px-4">Difference</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-white">{r.id}</div>
                  <div className="text-[11px] text-zinc-400 truncate max-w-[180px]">{r.description}</div>
                </td>
                <td className="py-3 px-4 text-zinc-400">{r.source}</td>
                <td className="py-3 px-4 font-tabular font-semibold text-white">{r.amount}</td>
                <td className="py-3 px-4 text-zinc-300 truncate max-w-[200px]">{r.matchedWith}</td>
                <td className="py-3 px-4 font-tabular">
                  <span className={r.difference === "₹0" ? "text-zinc-500" : "text-amber-400 font-semibold"}>
                    {r.difference}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {r.method}
                  </span>
                </td>
                <td className="py-3 px-4 font-tabular">
                  <span className={r.confidence >= 0.95 ? "text-emerald-400" : r.confidence >= 0.85 ? "text-zinc-300" : "text-rose-400"}>
                    {(r.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      r.status === "RECONCILED"
                        ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                        : r.status === "REVIEW"
                        ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                        : "bg-rose-950/40 border-rose-800/60 text-rose-300"
                    }`}
                  >
                    {r.status}
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
