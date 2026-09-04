"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  Play, 
  Database, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const [runningClose, setRunningClose] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(true);
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const stages = [
    "Ingesting 4 sources...",
    "Normalizing schema...",
    "Deterministic multi-source matching...",
    "Detecting duplicate entries...",
    "Investigating exceptions with AI agent...",
    "Benchmarking ground-truth evaluation...",
    "Calculating 30-day forward cash position...",
    "Finalizing close report..."
  ];

  const handleRunClose = () => {
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
    }, 450);
  };

  return (
    <AppShell>
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">September 2026 Close</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              Batch #CLOSE-2026-09
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time deterministic reconciliation with AI exception investigation and forward cash forecast.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setDemoLoaded(true)}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center space-x-1.5"
          >
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span>{demoLoaded ? "Demo Data Loaded (127)" : "Load Demo Dataset"}</span>
          </button>

          <button
            onClick={handleRunClose}
            disabled={runningClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{runningClose ? "Processing Close..." : "RUN CLOSE"}</span>
          </button>
        </div>
      </div>

      {/* Progress banner when running */}
      {runningClose && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/80 animate-in fade-in space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-200">
            <span className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeStage}</span>
            </span>
            <span className="text-zinc-400">Processing real synthetic batch...</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-1.5 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* 6 KPI Cards (Section 10) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Records Processed</div>
          <div className="text-2xl font-bold font-tabular text-white mt-1">127</div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono">Across 4 sources</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Match Rate</div>
          <div className="text-2xl font-bold font-tabular text-emerald-400 mt-1">94.5%</div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono">120 of 127 records</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Resolved Records</div>
          <div className="text-2xl font-bold font-tabular text-zinc-100 mt-1">116</div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono">Proven deterministic</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Exceptions</div>
          <div className="text-2xl font-bold font-tabular text-amber-400 mt-1">7</div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono">3 Critical · 4 Review</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Current Cash</div>
          <div className="text-2xl font-bold font-tabular text-white mt-1">₹18.4L</div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono">Verified bank ledger</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">30-Day Forecast</div>
          <div className="text-2xl font-bold font-tabular text-zinc-200 mt-1">₹18.1L</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">STATUS: SAFE (&gt;₹8L)</div>
        </div>
      </div>

      {/* Main Grid: Reconciliation Health & Exceptions Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Reconciliation Health & Stream */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reconciliation Health Bars (Section 10) */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Reconciliation Health</h3>
                <p className="text-xs text-zinc-400">Cross-source deterministic alignment</p>
              </div>
              <a href="/reconciliation" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1">
                <span>View Full Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-300">Bank ↔ Processor Settlements</span>
                  <span className="text-zinc-200 font-bold">96%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "96%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-300">Processor ↔ General Ledger</span>
                  <span className="text-zinc-200 font-bold">92%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-300 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-300">General Ledger ↔ Customer Invoices</span>
                  <span className="text-zinc-200 font-bold">98%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "98%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Exceptions Requiring Attention (Section 11) */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Exceptions Requiring Attention</h3>
                <span className="text-xs font-mono text-zinc-400">(3 Critical · 4 Review)</span>
              </div>
              <a href="/exceptions" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1">
                <span>Exceptions Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {/* Row 1: EX-102 */}
              <a
                href="/exceptions/EX-102"
                className="py-3 px-2 flex items-center justify-between hover:bg-zinc-800/40 rounded-lg transition-colors group block"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white">EX-102</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300">
                        ₹50 settlement difference
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Invoice INV-1022 vs Processor SET-5521 · Likely processor fee
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-emerald-400">94% Confidence</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Needs Approval →</div>
                </div>
              </a>

              {/* Row 2: EX-108 */}
              <a
                href="/exceptions/EX-108"
                className="py-3 px-2 flex items-center justify-between hover:bg-zinc-800/40 rounded-lg transition-colors group block"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white">EX-108</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300">
                        Missing invoice (₹72,400)
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Bank deposit with no corroborating processor or invoice record
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-rose-400">38% Confidence</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Unable to resolve →</div>
                </div>
              </a>

              {/* Row 3: EX-111 */}
              <a
                href="/exceptions/EX-111"
                className="py-3 px-2 flex items-center justify-between hover:bg-zinc-800/40 rounded-lg transition-colors group block"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white">EX-111</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300">
                        Potential duplicate (₹25,000)
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Duplicate transaction ID #TXN-9092 on same settlement date
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-emerald-400">97% Confidence</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Review match →</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Cash Position & Quick Summary (Section 12) */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-sm font-semibold text-white">Cash Position Overview</h3>
              <a href="/cash-position" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1">
                <span>30-Day Curve</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/40">
                <span className="text-zinc-400">Current Cash</span>
                <span className="text-white font-bold">₹18.4L</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/40">
                <span className="text-zinc-400">Expected Receivables</span>
                <span className="text-emerald-400 font-semibold">+₹7.2L</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/40">
                <span className="text-zinc-400">Upcoming Expenses</span>
                <span className="text-zinc-300">-₹5.4L</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/40">
                <span className="text-zinc-400">Taxes & Statutory</span>
                <span className="text-zinc-300">-₹1.2L</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm">
                <span className="text-zinc-200 font-bold">Projected 30-Day Cash</span>
                <span className="text-white font-black">₹18.1L</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Safety Threshold:</span>
                <span className="font-mono font-semibold">₹8.0L</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Projected Buffer:</span>
                <span className="font-mono text-emerald-400 font-semibold">+₹10.1L</span>
              </div>
              <p className="text-[10px] text-zinc-400 pt-1">
                Calculated strictly via deterministic cash flow logic.
              </p>
            </div>
          </div>

          {/* Controller Evaluation Callout */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ground-Truth Verification</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every synthetic record contains hidden ground truth. Our evaluation engine calculates real precision, recall, and false-resolution rates.
            </p>
            <a
              href="/evaluation"
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Inspect Evaluation Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
