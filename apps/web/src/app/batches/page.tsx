"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Clock, 
  Play,
  FileCheck
} from "lucide-react";

export default function BatchesPage() {
  const [selectedSource, setSelectedSource] = useState<string>("bank");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const sources = [
    { id: "bank", name: "Bank Transactions", schema: "id, date, description, amount, currency, reference, type" },
    { id: "processor", name: "Processor Settlements", schema: "id, settlement_date, processor, gross_amount, fee, net_amount, reference" },
    { id: "ledger", name: "General Ledger", schema: "id, date, account, description, debit, credit, reference" },
    { id: "invoices", name: "Invoices", schema: "id, invoice_number, customer, invoice_date, due_date, amount, status" },
  ];

  const handleSimulatedUpload = (sourceId: string) => {
    setUploadStatus("Uploading CSV...");
    setTimeout(() => setUploadStatus("Validating columns..."), 400);
    setTimeout(() => setUploadStatus("Normalizing currency & dates..."), 800);
    setTimeout(() => setUploadStatus("Importing into PostgreSQL..."), 1200);
    setTimeout(() => setUploadStatus("Ready for Reconciliation"), 1600);
  };

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Reconciliation Batches</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Ingest and validate financial statements from bank accounts, payment gateways, and ERPs.
          </p>
        </div>

        <button 
          onClick={() => handleSimulatedUpload(selectedSource)}
          className="px-3.5 py-2 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Reconciliation Batch</span>
        </button>
      </div>

      {/* Multi-Source Ingestion Deck (Section 13) */}
      <div className="grid md:grid-cols-4 gap-3">
        {sources.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedSource(s.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
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
      <div className="p-8 rounded-2xl bg-zinc-900/30 border-2 border-dashed border-zinc-800 hover:border-zinc-700 text-center transition-colors">
        <div className="h-10 w-10 mx-auto rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-300 mb-3">
          <Upload className="w-5 h-5" />
        </div>
        <div className="text-sm font-semibold text-white">
          Drop {sources.find(s => s.id === selectedSource)?.name} CSV here
        </div>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Files are validated against the strict schema before insertion into the database.
        </p>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handleSimulatedUpload(selectedSource)}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
          >
            Select File or Ingest Demo Source
          </button>
        </div>

        {uploadStatus && (
          <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{uploadStatus}</span>
          </div>
        )}
      </div>

      {/* Batches History Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Historical Close Batches
          </h3>
          <span className="text-[10px] font-mono text-zinc-400">Showing 3 batches</span>
        </div>

        <div className="divide-y divide-zinc-800/60 font-mono text-xs">
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-800/20 transition-colors">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">BATCH-2026-09-DEMO</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                  COMPLETED
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                127 records ingested across Bank, Processor, General Ledger, and Invoices
              </div>
            </div>

            <div className="flex items-center space-x-6 text-zinc-400 text-right">
              <div>
                <div className="text-[10px] text-zinc-400">Match Rate</div>
                <div className="text-zinc-200 font-bold">94.5%</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">Exceptions</div>
                <div className="text-amber-400 font-bold">7</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">Run Time</div>
                <div className="text-zinc-200">1.4s</div>
              </div>
              <a
                href="/batches/BATCH-2026-09-DEMO"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors flex items-center space-x-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-800/20 transition-colors">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">BATCH-2026-08-CLOSE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  ARCHIVED
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                98 records ingested · Fully reconciled books
              </div>
            </div>

            <div className="flex items-center space-x-6 text-zinc-400 text-right">
              <div>
                <div className="text-[10px] text-zinc-400">Match Rate</div>
                <div className="text-zinc-200 font-bold">97.2%</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">Exceptions</div>
                <div className="text-zinc-400 font-bold">0 unresolved</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400">Run Time</div>
                <div className="text-zinc-200">1.1s</div>
              </div>
              <a
                href="/batches/BATCH-2026-08-CLOSE"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors flex items-center space-x-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
