"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { 
  Compass, 
  Layers, 
  GitMerge, 
  AlertTriangle, 
  Wallet, 
  ShieldCheck, 
  FileText, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileSpreadsheet, 
  Database, 
  Scale, 
  TrendingUp, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Zap,
  Code
} from "lucide-react";

import { useTour } from "@/lib/tour-context";

type TabKey = "overview" | "csv_guide" | "reconciliation" | "exceptions" | "cash_position" | "audit_trail" | "evaluation";

interface SchemaSpec {
  source: string;
  sourceKey: string;
  filename: string;
  description: string;
  headers: string[];
  sampleRow: Record<string, string>;
  notes: string;
}

const SCHEMAS: SchemaSpec[] = [
  {
    source: "Bank Statement",
    sourceKey: "bank",
    filename: "bank_transactions.csv",
    description: "Operating account deposits, withdrawals, and wire references.",
    headers: ["date", "description", "amount", "currency", "reference", "type"],
    sampleRow: {
      date: "2026-09-03",
      description: "STRIPE PAYOUT STRIPE-82931 #5521",
      amount: "31750.0000",
      currency: "INR",
      reference: "STRIPE-82931",
      type: "CREDIT"
    },
    notes: "Positive decimal amounts. CREDIT for deposits, DEBIT for disbursements."
  },
  {
    source: "Payment Processor / Gateway",
    sourceKey: "processor",
    filename: "processor_settlements.csv",
    description: "Stripe and Razorpay batch settlements with interchange MDR fees.",
    headers: ["settlement_date", "processor", "transaction_id", "gross_amount", "fee", "net_amount", "currency", "status", "reference"],
    sampleRow: {
      settlement_date: "2026-09-03",
      processor: "Stripe",
      transaction_id: "SET-5521",
      gross_amount: "31800.0000",
      fee: "50.0000",
      net_amount: "31750.0000",
      currency: "INR",
      status: "SETTLED",
      reference: "STRIPE-82931"
    },
    notes: "Deterministic rule: gross_amount - fee = net_amount."
  },
  {
    source: "General Ledger / ERP",
    sourceKey: "ledger",
    filename: "ledger_entries.csv",
    description: "ERP journal entries (NetSuite / QuickBooks) tracking debits and credits.",
    headers: ["date", "account", "description", "debit", "credit", "reference"],
    sampleRow: {
      date: "2026-09-03",
      account: "1010 - Operating Bank Account",
      description: "Stripe Settlement STRIPE-82931",
      debit: "31750.0000",
      credit: "0.0000",
      reference: "STRIPE-82931"
    },
    notes: "Double-entry format: either debit or credit must be non-zero."
  },
  {
    source: "Customer Invoices",
    sourceKey: "invoices",
    filename: "invoices.csv",
    description: "B2B SaaS sales invoices tracking due dates and open receivables.",
    headers: ["invoice_number", "customer", "invoice_date", "due_date", "amount", "currency", "status"],
    sampleRow: {
      invoice_number: "INV-1022",
      customer: "Acme Technologies Pvt Ltd",
      invoice_date: "2026-09-01",
      due_date: "2026-09-15",
      amount: "31800.0000",
      currency: "INR",
      status: "PARTIAL"
    },
    notes: "Source of truth for accounts receivable and 30-day forward cash."
  }
];

export default function WalkthroughPage() {
  const { startTour, isTourActive } = useTour();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabKey | null;
      if (tabParam && ["overview", "csv_guide", "reconciliation", "exceptions", "cash_position", "audit_trail", "evaluation"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Product Walkthrough & CSV Specification</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-800/60">
              Buildathon Tour
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Architecture guide, CSV schemas, reconciliation rules, and benchmarks.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => startTour(0)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center space-x-1.5 shadow-md group"
          >
            <Compass className={`w-3.5 h-3.5 ${isTourActive ? "animate-spin" : ""}`} />
            <span>{isTourActive ? "Resume Live Tour" : "Start Live Tour"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-zinc-200 transition-colors flex items-center space-x-1.5"
          >
            <span>Open Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Live Interactive Tour Launch Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-blue-50/40 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div className="flex items-start space-x-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/60 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-zinc-950 dark:text-white">Live Multi-Page Guided Walkthrough</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40">
                Interactive Popup
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 font-sans">
              Step through all 7 pages sequentially with live step-by-step guidance and automatic page navigation.
            </p>
          </div>
        </div>

        <button
          onClick={() => startTour(0)}
          className="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 shrink-0 group"
        >
          <span>{isTourActive ? "Resume Guided Tour" : "Launch Tour (Step 1 to 7)"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Interactive Navigation Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-zinc-800/60 text-xs font-mono no-scrollbar">
        {[
          { key: "overview", label: "1. Overview & Problem", icon: Sparkles },
          { key: "csv_guide", label: "2. CSV Upload & Schemas", icon: FileSpreadsheet },
          { key: "reconciliation", label: "3. 5-Pass Matching Engine", icon: GitMerge },
          { key: "exceptions", label: "4. AI Exception Triage", icon: AlertTriangle },
          { key: "cash_position", label: "5. Cash Runway & Stress", icon: Wallet },
          { key: "audit_trail", label: "6. Merkle Audit Trail", icon: ShieldCheck },
          { key: "evaluation", label: "7. Ground-Truth Benchmarks", icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`px-3 py-2 rounded-lg whitespace-nowrap flex items-center space-x-1.5 transition-all shrink-0 ${
                isActive
                  ? "bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Problem */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>The Problem: Disconnected Financial Systems</span>
            </h2>
            <p className="text-xs text-zinc-400 max-w-3xl">
              Finance teams manually reconcile 4 disconnected systems every month-end:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                <div className="text-xs font-bold text-white mb-1">1. Bank Statement</div>
                <div className="text-[11px] text-zinc-400">Raw cash deposits and withdrawals showing true settled cash.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                <div className="text-xs font-bold text-white mb-1">2. Payment Gateway</div>
                <div className="text-[11px] text-zinc-400">Stripe & Razorpay sales minus interchange MDR processing fees.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                <div className="text-xs font-bold text-white mb-1">3. General Ledger</div>
                <div className="text-[11px] text-zinc-400">ERP journal entries (NetSuite/QuickBooks) with balanced debits and credits.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                <div className="text-xs font-bold text-white mb-1">4. Customer Invoices</div>
                <div className="text-[11px] text-zinc-400">B2B sales contracts, due dates, and open receivables.</div>
              </div>
            </div>
          </div>

          {/* Why CLOSE is Different */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-3">Why Traditional Tools Fail</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
                <div className="text-rose-400 font-bold uppercase text-[11px]">Spreadsheet Fragility</div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  VLOOKUPs break on typos and date lags. High manual effort with zero audit trails.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
                <div className="text-amber-400 font-bold uppercase text-[11px]">LLM Hallucinations</div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  General LLMs hallucinate math. Auditors reject non-deterministic closes immediately.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/60 space-y-1.5">
                <div className="text-emerald-400 font-bold uppercase text-[11px]">The CLOSE Standard</div>
                <p className="text-zinc-300 font-sans text-[11px]">
                  Deterministic math for reconciliation + AI tool reasoning + SHA-256 Merkle chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CSV Upload Guide & Schemas */}
      {activeTab === "csv_guide" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>CSV File Specification & Ingestion Guide</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Required header columns, data formats, and sample files.
                </p>
              </div>
              <Link
                href="/batches"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono transition-colors flex items-center space-x-1 shrink-0 shadow-sm"
              >
                <span>Go to Ingestion Deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* How the 4 CSVs Connect Across the Finance Graph */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transaction Flow Across 4 Files</span>
                </span>
                <span className="text-[10px] text-zinc-500">Shared Reference & Decimal Balance</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[10px]">
                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800">
                  <div className="text-amber-400 font-bold uppercase mb-1">1. Customer Invoices</div>
                  <div className="text-zinc-200 font-semibold">INV-1022 · ₹31,800</div>
                  <div className="text-zinc-400 text-[9px] mt-0.5">Acme Tech · Due Sep 15</div>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800">
                  <div className="text-blue-400 font-bold uppercase mb-1">2. Payment Gateway</div>
                  <div className="text-zinc-200 font-semibold">SET-5521 &rarr; Net ₹31,750</div>
                  <div className="text-zinc-400 text-[9px] mt-0.5">Gross ₹31,800 · Fee ₹50</div>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800">
                  <div className="text-emerald-400 font-bold uppercase mb-1">3. Bank Statement</div>
                  <div className="text-zinc-200 font-semibold">STRIPE-82931 · Credit ₹31,750</div>
                  <div className="text-zinc-400 text-[9px] mt-0.5">HDFC Current Account</div>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800">
                  <div className="text-purple-400 font-bold uppercase mb-1">4. General Ledger</div>
                  <div className="text-zinc-200 font-semibold">STRIPE-82931 · Dr ₹31,750</div>
                  <div className="text-zinc-400 text-[9px] mt-0.5">Dr 1010 Bank / Cr 1200 AR</div>
                </div>
              </div>
            </div>

            {/* 4 Schema Cards */}
            <div className="space-y-4">
              {SCHEMAS.map((spec) => (
                <div key={spec.sourceKey} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3 mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{spec.source}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                          {spec.filename}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans mt-0.5">{spec.description}</p>
                    </div>

                    <a
                      href={`/demo/${spec.filename}`}
                      download={spec.filename}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
                    >
                      <Download className="w-3 h-3 text-zinc-400" />
                      <span>Download Sample CSV</span>
                    </a>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">
                        Required Column Headers:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {spec.headers.map((h) => (
                          <code key={h} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 text-[11px]">
                            {h}
                          </code>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">
                        Sample Row:
                      </span>
                      <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-300 overflow-x-auto whitespace-pre">
                        {spec.headers.map((h) => `${h}: "${spec.sampleRow[h]}"`).join(",  ")}
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 font-sans pt-1">
                      <span className="text-zinc-300 font-semibold font-mono">Rule:</span> {spec.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 5-Pass Matching Engine */}
      {activeTab === "reconciliation" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <GitMerge className="w-4 h-4 text-emerald-400" />
                  <span>The 5-Pass Deterministic Reconciliation Pipeline</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sub-100ms matching across 5 algorithmic passes with zero arithmetic errors.
                </p>
              </div>
              <Link
                href="/reconciliation"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors flex items-center space-x-1"
              >
                <span>Inspect Match Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span>Pass 1: Duplicate Anomaly Hashes</span>
                  <span className="text-[10px] text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">Anomaly Guard</span>
                </div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Detects identical amount and reference hashes within 4 days to prevent duplicate payouts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span>Pass 2: Exact Reference & Amount Matching</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">100% Confidence</span>
                </div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Direct hash lookup linking bank deposits to invoices or gateway IDs with ₹0 difference.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span>Pass 3: Fee Variance Investigation</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">94% Confidence</span>
                </div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Accounts for gateway interchange MDR fees with exact arithmetic (gross - fee = net payout).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span>Pass 4: Multi-Day Date Tolerances</span>
                  <span className="text-[10px] text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">92% Confidence</span>
                </div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Matches transactions across weekend and clearing house (ACH/NEFT) 2-4 day banking windows.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span>Pass 5: Honest Flagging of Unbacked Records</span>
                  <span className="text-[10px] text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-800/40">Honest Refusal</span>
                </div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Flags unbacked debits to the Exception Center. CLOSE refuses to speculate on missing evidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Exception Triage */}
      {activeTab === "exceptions" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>AI Exception Triage & 3-Tier Evidence Tree</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Autonomous AI investigations formulate audit-grade evidence graphs for controller sign-off.
                </p>
              </div>
              <Link
                href="/exceptions"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors flex items-center space-x-1"
              >
                <span>Open Exception Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs mb-4">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-emerald-400 font-bold mb-1">Tier 1: Primary Evidence</div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Direct source record (Bank Statement credit or debit).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-blue-400 font-bold mb-1">Tier 2: Corroborating Evidence</div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Counterpart gateway settlement report with gross/fee deductions.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-purple-400 font-bold mb-1">Tier 3: Contextual Evidence</div>
                <p className="text-zinc-400 font-sans text-[11px]">
                  Customer invoice and historical payment schedule terms.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
              <div className="text-white font-bold mb-2">Controller Sign-off Actions:</div>
              <ul className="text-zinc-400 font-sans text-[11px] space-y-1.5">
                <li>• <strong>Accept AI Adjustment</strong>: Approves recommendation and writes adjusting journal entry.</li>
                <li>• <strong>Request Information</strong>: Escalates to procurement or vendor for receipts.</li>
                <li>• <strong>Mark Unresolved</strong>: Flags as honest discrepancy for month-end disclosure.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Cash Runway & Stress */}
      {activeTab === "cash_position" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>30-Day Forward Cash Position & Stress Testing</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Deterministic daily liquidity forecasting, payroll dip modeling, and scenario testing.
                </p>
              </div>
              <Link
                href="/cash-position"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors flex items-center space-x-1"
              >
                <span>View Cash Curve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-3">
              <div>
                <div className="text-zinc-400 text-[10px] uppercase font-bold">Deterministic Formula:</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">
                  Projected Cash = Current Cash + Receivables - Scheduled OPEX - Taxes
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                  <span className="text-white font-semibold block mb-1">Day 15 Payroll Dip:</span>
                  <span className="text-zinc-400 font-sans">
                    Models mid-month salary run (₹4.1L deduction) against the ₹8.0L safety floor.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                  <span className="text-white font-semibold block mb-1">Scenario Stress Testing:</span>
                  <span className="text-zinc-400 font-sans">
                    Simulates 7-day payment delays or 10% operating expense acceleration.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Merkle Audit Trail */}
      {activeTab === "audit_trail" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Cryptographic SHA-256 Merkle Chain</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  SOX Section 404, IFRS, and PCAOB audit compliance built into the database.
                </p>
              </div>
              <Link
                href="/audit-log"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors flex items-center space-x-1"
              >
                <span>View Audit Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-3">
              <div className="text-zinc-300 font-sans leading-relaxed text-[11px]">
                Every event—ingestion, matching, fee adjustment, or sign-off—is hashed with SHA-256 and chained to the previous entry.
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                <span className="text-white font-bold block mb-0.5">Tamper Detection:</span>
                Modifying any reconciled record breaks the Merkle root hash instantly, ensuring compliance.
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <a
                  href="http://localhost:8000/api/audit/export"
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download Compliance CSV Export</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Ground-Truth Evaluation */}
      {activeTab === "evaluation" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ground-Truth Verification & Benchmark Scorecard</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verifying accuracy against hidden ground-truth markers without data leakage.
                </p>
              </div>
              <Link
                href="/evaluation"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors flex items-center space-x-1"
              >
                <span>View Evaluation Benchmark</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-4">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-500 text-[10px] uppercase">Precision</div>
                <div className="text-emerald-400 font-bold text-lg mt-0.5">96.6%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-500 text-[10px] uppercase">Recall</div>
                <div className="text-emerald-400 font-bold text-lg mt-0.5">96.5%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-500 text-[10px] uppercase">Auto-Resolution</div>
                <div className="text-white font-bold text-lg mt-0.5">98.7%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <div className="text-zinc-500 text-[10px] uppercase">False Resolution</div>
                <div className="text-emerald-400 font-bold text-lg mt-0.5">1.1%</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
              <div className="text-white font-bold mb-1">The Honest Exception Guarantee:</div>
              <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                CLOSE achieves 96.6% precision by refusing to guess. When records have missing counterpart invoices or conflicting data, it categorizes them as honest exceptions rather than hallucinating false matches.
              </p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
