"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { api, CashPositionData } from "@/lib/api";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Clock,
  RotateCw,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { PipelineStepHeader } from "@/components/layout/pipeline-step-header";
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
  const [loading, setLoading] = useState(false);
  const [delayedReceivables, setDelayedReceivables] = useState(false);
  const [burnAcceleration, setBurnAcceleration] = useState(false);

  const [position, setPosition] = useState<CashPositionData>({
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

  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    async function loadCashData() {
      setLoading(true);
      try {
        const [posRes, fcRes] = await Promise.all([
          api.getCashPosition(),
          api.getCashForecast(timeframe),
        ]);
        if (posRes) setPosition(posRes);
        if (fcRes) setForecast(fcRes);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadCashData();
  }, [timeframe]);

  // Derive active chart data with scenario simulator adjustments
  const chartData = (forecast?.forecast_curve || []).map((pt: any) => {
    let bal = pt.balance_lakhs;
    if (delayedReceivables && pt.day_num <= 15) {
      bal = Math.max(7.2, bal - 2.1); // Simulates 7-day collection delay
    }
    if (burnAcceleration) {
      bal = Math.max(6.8, bal - (pt.day_num * 0.04)); // Simulates 10% burn acceleration
    }
    return {
      ...pt,
      balance_lakhs: parseFloat(bal.toFixed(1)),
    };
  });

  const simulatedMinCash = chartData.length > 0
    ? Math.min(...chartData.map((d: any) => d.balance_lakhs))
    : 11.6;

  const simulatedBuffer = parseFloat((simulatedMinCash - 8.0).toFixed(1));
  const isSimulatedSafe = simulatedMinCash >= 8.0;

  return (
    <AppShell>
      <PipelineStepHeader 
        currentStep={4} 
        subtitle="Step 4: Reconciled transactions flow into 30-day liquidity forecasting with payroll buffer stress testing." 
      />

      {/* Header & Timeframe Selector (Section 37) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Cash Position & Forward Forecast</h1>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                isSimulatedSafe
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  : "bg-rose-950/40 border-rose-800/60 text-rose-300"
              }`}
            >
              {isSimulatedSafe ? "STATUS: SAFE (>₹8.0L)" : "STATUS: WARNING (Floor Breached)"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Deterministic forward liquidity calculation based on verified receivables and recurring operational outflows.
          </p>
        </div>

        {/* Timeframe Selector Buttons (7, 14, 30, 60, 90 days) */}
        <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono overflow-x-auto no-scrollbar max-w-full">
          {[7, 14, 30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframe(days)}
              className={`px-2.5 py-1 rounded transition-colors shrink-0 ${
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

      {/* Primary 5 Cash Metrics (Section 12 & 37) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 font-mono text-xs">
        <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Current Cash</div>
          <div className="text-xl sm:text-2xl font-bold text-white font-tabular mt-1">
            ₹{(position.current_cash / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">Reconciled bank ledger</div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Expected Receivables</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-tabular mt-1">
            +₹{(position.expected_receivables / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">{position.open_invoice_count} open invoices</div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Upcoming Outflows</div>
          <div className="text-xl sm:text-2xl font-bold text-zinc-300 font-tabular mt-1">
            -₹{(position.upcoming_expenses / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">Payroll & vendors</div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase text-zinc-400">Taxes & Statutory</div>
          <div className="text-xl sm:text-2xl font-bold text-zinc-300 font-tabular mt-1">
            -₹{(position.taxes / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">GST & advance tax</div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase text-zinc-400">Projected {timeframe}-Day Cash</div>
          <div className="text-xl sm:text-2xl font-bold text-white font-tabular mt-1">
            ₹{(position.projected_30d_cash / 100000).toFixed(1)}L
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            Buffer: +₹{(position.safety_buffer / 100000).toFixed(1)}L
          </div>
        </div>
      </div>

      {/* Main Chart Card (Section 12 & 37: Recharts Monochrome Curve) */}
      <div className="p-4 sm:p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Projected Cash Liquidity Curve ({timeframe} Days)
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Projected minimum cash: ₹{simulatedMinCash}L · Safety threshold: ₹8.0L
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

        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#52525b" fontSize={11} tickLine={false} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} domain={[0, 25]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl font-mono text-xs text-white space-y-1">
                        <div className="font-bold border-b border-zinc-800 pb-1 text-zinc-300">
                          {data.day} · {data.date || ""}
                        </div>
                        <div className="flex justify-between space-x-4">
                          <span className="text-zinc-400">Balance:</span>
                          <span className="font-bold text-white font-tabular">₹{data.balance_lakhs}L</span>
                        </div>
                        {data.events && data.events.length > 0 && (
                          <div className="pt-1 text-[10px] text-amber-300">
                            ★ {data.events.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={8}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{ value: "Safety Floor ₹8L", fill: "#f59e0b", fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="balance_lakhs"
                stroke="#ffffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cashGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Stress-Test Simulator (Bonus Section 12) */}
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-white">Scenario Analysis & Liquidity Stress Test</h3>
          </div>
          <span className="text-[10px] text-zinc-400">Simulate adverse operating conditions</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-1">
          {/* Scenario 1 */}
          <div
            onClick={() => setDelayedReceivables(!delayedReceivables)}
            className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
              delayedReceivables
                ? "bg-zinc-900 border-amber-500/60"
                : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Scenario A: 7-Day Collection Delay</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${delayedReceivables ? "bg-amber-950/60 text-amber-300" : "text-zinc-400"}`}>
                {delayedReceivables ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Simulate delayed settlement of ₹2.1L customer invoice batch past the 15th payroll date.
            </p>
          </div>

          {/* Scenario 2 */}
          <div
            onClick={() => setBurnAcceleration(!burnAcceleration)}
            className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
              burnAcceleration
                ? "bg-zinc-900 border-amber-500/60"
                : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Scenario B: 10% Burn Acceleration</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${burnAcceleration ? "bg-amber-950/60 text-amber-300" : "text-zinc-400"}`}>
                {burnAcceleration ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Simulate unforeseen vendor and cloud infrastructure expense acceleration.
            </p>
          </div>
        </div>
      </div>

      {/* AI Controller Forecast Narrative (Section 38) */}
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-white">AI Controller Forecast Analysis</h3>
          </div>
          <span className="text-[10px] text-zinc-400">Formula-driven arithmetic · AI synthesized</span>
        </div>

        <div className="space-y-3 leading-relaxed text-zinc-300">
          <p>
            {forecast?.ai_explanation?.headline || "Cash position appears stable."}{" "}
            {forecast?.ai_explanation?.narrative}
          </p>

          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400 text-[10px] uppercase block">Projected Minimum Cash</span>
              <span className="text-white font-bold text-sm">₹{simulatedMinCash}L (Day 15)</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400 text-[10px] uppercase block">Safety Threshold</span>
              <span className="text-amber-400 font-bold text-sm">₹8.0L</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400 text-[10px] uppercase block">Safety Buffer</span>
              <span className={`font-bold text-sm ${simulatedBuffer >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {simulatedBuffer >= 0 ? `+₹${simulatedBuffer}L` : `-₹${Math.abs(simulatedBuffer)}L`} Buffer
              </span>
            </div>
          </div>

          {/* Primary Upcoming Outflows Cards (Section 38) */}
          <div className="pt-2">
            <h4 className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Primary Upcoming Scheduled Outflows
            </h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-400 text-[10px]">Due Day 15</div>
                <div className="font-bold text-white mt-0.5">₹4.1L · Payroll</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Engineering & Operations</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-400 text-[10px]">Due Day 5</div>
                <div className="font-bold text-white mt-0.5">₹0.8L · Cloud Infra</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">AWS monthly cluster billing</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-400 text-[10px]">Due Day 22</div>
                <div className="font-bold text-white mt-0.5">₹0.5L · Vendors</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Audit & legal retainers</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-zinc-400 text-[10px]">Due Day 30</div>
                <div className="font-bold text-white mt-0.5">₹1.2L · Taxes</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Quarterly advance tax provision</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
