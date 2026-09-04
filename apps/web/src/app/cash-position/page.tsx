"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Clock
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

export default function CashPositionPage() {
  const [timeframe, setTimeframe] = useState<number>(30);

  // 30-day projected deterministic cash curve
  const chartData = [
    { day: "Day 1", balance: 18.4, receivables: 0.0, outflows: 0.2 },
    { day: "Day 5", balance: 18.2, receivables: 1.5, outflows: 0.8 },
    { day: "Day 10", balance: 18.9, receivables: 2.1, outflows: 1.4 },
    { day: "Day 15", balance: 15.2, receivables: 0.4, outflows: 4.1 }, // Mid-month payroll
    { day: "Day 20", balance: 16.8, receivables: 2.5, outflows: 0.9 },
    { day: "Day 25", balance: 19.1, receivables: 3.1, outflows: 0.8 },
    { day: "Day 30", balance: 18.1, receivables: 0.8, outflows: 1.8 },
  ];

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Cash Position & 30-Day Forecast</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
              STATUS: SAFE (&gt;₹8.0L)
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Deterministic forward liquidity calculation based on verified receivables and recurring outflows.
          </p>
        </div>

        {/* Timeframe selector (Section 37) */}
        <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
          {[7, 14, 30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframe(days)}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeframe === days
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Primary 5 Cash Metrics (Section 12, 37) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Current Cash</div>
          <div className="text-2xl font-bold text-white font-tabular mt-1">₹18.4L</div>
          <div className="text-[10px] text-zinc-400 mt-1">Reconciled balance</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Expected Receivables</div>
          <div className="text-2xl font-bold text-emerald-400 font-tabular mt-1">+₹7.2L</div>
          <div className="text-[10px] text-zinc-400 mt-1">14 open invoices</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Upcoming Outflows</div>
          <div className="text-2xl font-bold text-zinc-300 font-tabular mt-1">-₹5.4L</div>
          <div className="text-[10px] text-zinc-400 mt-1">Payroll & vendors</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Taxes & Statutory</div>
          <div className="text-2xl font-bold text-zinc-300 font-tabular mt-1">-₹1.2L</div>
          <div className="text-[10px] text-zinc-400 mt-1">GST & TDS reserve</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Projected 30-Day Cash</div>
          <div className="text-2xl font-bold text-white font-tabular mt-1">₹18.1L</div>
          <div className="text-[10px] text-emerald-400 mt-1">Buffer: +₹10.1L</div>
        </div>
      </div>

      {/* Main Chart Card (Section 12, monochrome Recharts) */}
      <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Projected Cash Curve (in ₹ Lakhs)</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Minimum projected cash: ₹11.6L · Safety threshold: ₹8.0L
            </p>
          </div>
          <div className="flex items-center space-x-4 font-mono text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-zinc-300">Projected Balance</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-zinc-400">Safety Floor (₹8L)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#52525b" fontSize={11} tickLine={false} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} domain={[0, 25]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#3f3f46",
                  fontSize: "12px",
                  borderRadius: "8px",
                  color: "#ffffff"
                }}
              />
              <ReferenceLine y={8} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Safety Floor ₹8L", fill: "#f59e0b", fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#ffffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Narrative Explanation (Section 38) */}
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-white">AI Controller Forecast Analysis</h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Formula-driven numbers · AI explained
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono text-zinc-300 leading-relaxed">
          <p>
            Cash position remains <span className="text-emerald-400 font-bold">STABLE</span> throughout the 30-day close cycle.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400 text-[10px] uppercase block">Projected Minimum Cash</span>
              <span className="text-white font-bold text-sm">₹11.6L (Day 15)</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400 text-[10px] uppercase block">Safety Threshold</span>
              <span className="text-amber-400 font-bold text-sm">₹8.0L</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400 text-[10px] uppercase block">Safety Buffer</span>
              <span className="text-emerald-400 font-bold text-sm">+₹3.6L Minimum Buffer</span>
            </div>
          </div>
          <p className="text-zinc-400 text-[11px] pt-1">
            Primary upcoming outflows: Mid-month engineering payroll (₹4.1L on Day 15), AWS cloud infrastructure (₹0.8L on Day 5), and quarterly advance tax provisions (₹1.2L).
          </p>
        </div>
      </div>
    </AppShell>
  );
}
