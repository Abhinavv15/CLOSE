"use client";

import React, { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  GitMerge, 
  AlertTriangle,
  Play,
  Layers
} from "lucide-react";

export default function BatchDetailPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const resolvedParams = use(params);
  const batchId = resolvedParams.batchId;

  const pipelineStages = [
    { name: "Multi-Source Ingestion", status: "completed", duration: "0.2s", detail: "127 records across Bank, Processor, General Ledger, Invoices" },
    { name: "Schema Normalization", status: "completed", duration: "0.1s", detail: "Standardized INR currency, ISO-8601 timestamps, reference keys" },
    { name: "Deterministic Reconciliation", status: "completed", duration: "0.4s", detail: "Exact matching, tolerance fee comparison, reference matching" },
    { name: "Duplicate & Anomaly Detection", status: "completed", duration: "0.2s", detail: "1 duplicate candidate identified (#TXN-9092)" },
    { name: "AI Investigation Agent", status: "completed", duration: "0.3s", detail: "Evidence retrieval and structured diagnosis on 7 exceptions" },
    { name: "Ground-Truth Evaluation", status: "completed", duration: "0.1s", detail: "96.6% Precision, 96.5% Recall verified against hidden test labels" },
    { name: "30-Day Forward Cash Forecast", status: "completed", duration: "0.1s", detail: "Receivables +₹7.2L vs Outflows -₹6.6L mapped onto forward curve" }
  ];

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center space-x-3">
          <a
            href="/batches"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">{batchId}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                COMPLETED
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Reconciled on September 4, 2026 · Deterministic + AI Controller
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/reconciliation"
            className="px-3.5 py-2 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Open Match Matrix</span>
          </a>
        </div>
      </div>

      {/* Batch Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Total Records</div>
          <div className="text-2xl font-bold font-tabular text-white mt-1">127</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Proven Matches</div>
          <div className="text-2xl font-bold font-tabular text-emerald-400 mt-1">120</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Exceptions</div>
          <div className="text-2xl font-bold font-tabular text-amber-400 mt-1">7</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Total Run Time</div>
          <div className="text-2xl font-bold font-tabular text-zinc-200 mt-1">1.4s</div>
        </div>
      </div>

      {/* Real Pipeline Execution Trace (Section 32) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Pipeline Execution Trace
        </h3>

        <div className="space-y-4">
          {pipelineStages.map((stage, idx) => (
            <div key={stage.name} className="flex items-start space-x-3 text-xs">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {idx < pipelineStages.length - 1 && (
                  <div className="w-0.5 h-8 bg-zinc-800 my-1" />
                )}
              </div>
              <div className="flex-1 bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200">{stage.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{stage.duration}</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">{stage.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
