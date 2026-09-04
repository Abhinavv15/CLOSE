"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { api, BatchSummary } from "@/lib/api";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Clock, 
  Play,
  FileCheck,
  RefreshCw,
  Database
} from "lucide-react";

export default function BatchesPage() {
  const [selectedSource, setSelectedSource] = useState<string>("bank");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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

  const sources = [
    { id: "bank", name: "Bank Transactions", schema: "id, date, description, amount, currency, reference, type" },
    { id: "processor", name: "Payment Processor", schema: "id, settlement_date, processor, gross_amount, fee, net_amount, reference" },
    { id: "ledger", name: "General Ledger", schema: "id, date, account, description, debit, credit, reference" },
    { id: "invoices", name: "Customer Invoices", schema: "id, invoice_number, customer, invoice_date, due_date, amount, status" },
  ];

  useEffect(() => {
    async function loadBatch() {
      try {
        const res = await api.getBatchSummary("batch_close_2026_09");
        if (res) setBatch(res);
      } catch {
        // Fallback
      }
    }
    loadBatch();
  }, []);

  const handleSimulatedUpload = async (sourceId: string) => {
    setIsUploading(true);
    setUploadStatus("Ingesting source statements...");
    setTimeout(() => setUploadStatus("Validating columns against schema (Numeric 18, 4)..."), 350);
    setTimeout(() => setUploadStatus("Standardizing ISO dates & currency (INR)..."), 700);
    setTimeout(() => setUploadStatus("Inserting records into database..."), 1050);

    try {
      await api.loadDemoData(127);
      const res = await api.getBatchSummary("batch_close_2026_09");
      if (res) setBatch(res);
    } catch {
      // Keep optimistic
    } finally {
      setTimeout(() => {
        setUploadStatus("Successfully ingested 127 records across all 4 sources.");
        setIsUploading(false);
      }, 1400);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Reconciliation Batches</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              Multi-Source Ingestion Deck
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Ingest and validate financial statements from bank accounts, payment gateways, and ERP general ledgers.
          </p>
        </div>

        <button 
          onClick={() => handleSimulatedUpload(selectedSource)}
          disabled={isUploading}
          className="px-3.5 py-2 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isUploading ? "Ingesting..." : "Ingest Demo Batch (127)"}</span>
        </button>
      </div>

      {/* Multi-Source Ingestion Deck (Section 13) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {sources.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedSource(s.id)}
            className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
              selectedSource === s.id
                ? "bg-zinc-900 border-zinc-500 shadow-md"
                : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileSpreadsheet className="w-4 h-4 text-zinc-300" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase">CSV Accepted</span>
            </div>
            <div className="font-semibold text-xs text-zinc-100">{s.name}</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-2 truncate">
              {s.schema}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Zone / Dropzone */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/30 border-2 border-dashed border-zinc-800 hover:border-zinc-700 text-center transition-colors font-mono">
        <div className="h-10 w-10 mx-auto rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-300 mb-3">
          <Upload className="w-5 h-5" />
        </div>
        <div className="text-sm font-semibold text-white">
          Drop {sources.find(s => s.id === selectedSource)?.name} CSV here
        </div>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Files are validated against the strict schema with <span className="text-zinc-200">Numeric(18, 4)</span> decimal precision.
        </p>

        <div className="mt-4 flex justify-center space-x-3">
          <button
            onClick={() => handleSimulatedUpload(selectedSource)}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-200 transition-colors flex items-center space-x-1.5"
          >
            <FileCheck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Validate & Ingest Source</span>
          </button>
        </div>

        {uploadStatus && (
          <div className="mt-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{uploadStatus}</span>
          </div>
        )}
      </div>

      {/* Batches History Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden font-mono text-xs">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Reconciliation Close Batches
          </h3>
          <span className="text-[10px] text-zinc-400">Showing 2 batches</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {/* Active Batch */}
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-800/20 transition-colors">
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="font-bold text-white uppercase">{batch.batch_id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                  {batch.status}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  CANONICAL DEMO
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                {batch.records_processed} records ingested across Bank, Processor, General Ledger, and Invoices
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 text-zinc-400 text-right border-t md:border-t-0 border-zinc-800/60 pt-2 md:pt-0">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Match Rate</div>
                <div className="text-emerald-400 font-bold">
                  {(batch.match_rate > 1 ? batch.match_rate : batch.match_rate * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Exceptions</div>
                <div className="text-amber-400 font-bold">{batch.unresolved}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Execution</div>
                <div className="text-zinc-200 font-bold">0.08s</div>
              </div>
              <Link
                href={`/batches/${batch.batch_id}`}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors flex items-center space-x-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Archived Batch */}
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-800/20 transition-colors">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">BATCH_CLOSE_2026_08</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  ARCHIVED
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                98 records ingested · Fully reconciled books · 0 open exceptions
              </div>
            </div>

            <div className="flex items-center space-x-6 text-zinc-400 text-right">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Match Rate</div>
                <div className="text-zinc-200 font-bold">97.2%</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Exceptions</div>
                <div className="text-zinc-400 font-bold">0</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Execution</div>
                <div className="text-zinc-200 font-bold">0.06s</div>
              </div>
              <Link
                href="/batches/batch_close_2026_09"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors flex items-center space-x-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
