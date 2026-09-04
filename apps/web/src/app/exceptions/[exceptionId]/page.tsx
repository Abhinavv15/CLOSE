"use client";

import React, { useState, use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  ArrowDown,
  Sparkles,
  Clock,
  Send,
  HelpCircle,
  Layers
} from "lucide-react";

export default function ExceptionDetailPage({
  params,
}: {
  params: Promise<{ exceptionId: string }>;
}) {
  const resolvedParams = use(params);
  const exceptionId = resolvedParams.exceptionId || "EX-102";
  const isUnresolvedExample = exceptionId === "EX-108";

  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [reason, setReason] = useState("");
  const [investigating, setInvestigating] = useState(false);
  const [investigationDone, setInvestigationDone] = useState(true);

  const handleApprove = () => {
    setApproved(true);
    setRejected(false);
  };

  const handleReject = () => {
    setRejected(true);
    setApproved(false);
  };

  return (
    <AppShell>
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center space-x-3">
          <a
            href="/exceptions"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">{exceptionId}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                isUnresolvedExample 
                  ? "bg-rose-950/40 border-rose-800/60 text-rose-300" 
                  : "bg-amber-950/40 border-amber-800/60 text-amber-300"
              }`}>
                {isUnresolvedExample ? "UNRESOLVED EXCEPTION" : "AMOUNT MISMATCH (REVIEW)"}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isUnresolvedExample
                ? "Bank credit with zero corroborating records across all connected sources."
                : "₹50 discrepancy between invoice and processor gateway payout."}
            </p>
          </div>
        </div>

        {/* Amount Summary Trio (Section 26) */}
        <div className="flex items-center space-x-4 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase">Expected</div>
            <div className="text-sm font-bold text-white font-tabular">{isUnresolvedExample ? "₹0 (Unknown)" : "₹31,800"}</div>
          </div>
          <div className="border-l border-zinc-800 pl-4">
            <div className="text-[10px] text-zinc-400 uppercase">Actual Received</div>
            <div className="text-sm font-bold text-white font-tabular">{isUnresolvedExample ? "₹72,400" : "₹31,750"}</div>
          </div>
          <div className="border-l border-zinc-800 pl-4">
            <div className="text-[10px] text-zinc-400 uppercase">Difference</div>
            <div className="text-sm font-bold text-amber-400 font-tabular">{isUnresolvedExample ? "₹72,400" : "-₹50"}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Evidence Room (Left) and AI Investigation + Approval (Right) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: 3-Tier Connected Evidence Visual (Section 26 & 28) */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-zinc-300" />
                <h3 className="text-sm font-semibold text-white">Evidence Lineage</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {isUnresolvedExample ? "0 Corroborating Records" : "3 Corroborating Records"}
              </span>
            </div>

            {!isUnresolvedExample ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Evidence Item 1: Invoice */}
                <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Source 1: Invoice Record</div>
                    <div className="text-zinc-100 font-bold mt-0.5">INV-1022 · Acme Corp</div>
                    <div className="text-[11px] text-zinc-400">Date: 2026-09-01 · Due: 2026-09-15</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-tabular">₹31,800</div>
                    <span className="text-[10px] text-emerald-400">MATCHED REF</span>
                  </div>
                </div>

                <div className="flex justify-center text-zinc-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                {/* Evidence Item 2: Processor Settlement */}
                <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Source 2: Processor Settlement</div>
                    <div className="text-zinc-100 font-bold mt-0.5">SET-5521 (Stripe Gateway)</div>
                    <div className="text-[11px] text-zinc-400">Gross: ₹31,800 · Deducted Fee: ₹50</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-zinc-200 font-tabular">₹31,750</div>
                    <span className="text-[10px] text-amber-400">₹50 FEE VARIANCE</span>
                  </div>
                </div>

                <div className="flex justify-center text-zinc-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                {/* Evidence Item 3: Bank Transaction */}
                <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Source 3: Bank Credit</div>
                    <div className="text-zinc-100 font-bold mt-0.5">BANK-88421 · HDFC Current A/C</div>
                    <div className="text-[11px] text-zinc-400">UTR: STRIPE*82931 · Cleared: 2026-09-03</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400 font-tabular">₹31,750</div>
                    <span className="text-[10px] text-emerald-400">NET SETTLEMENT</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Insufficient Evidence View (Section 28) */
              <div className="p-6 rounded-xl bg-rose-950/20 border border-rose-900/50 text-center space-y-3 font-mono">
                <HelpCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <div className="text-sm font-bold text-rose-300">INSUFFICIENT EVIDENCE</div>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  CLOSE queried Bank, Processor Settlements, General Ledger, and Customer Invoices. No matching reference or matching amount exists.
                </p>
                <div className="text-xs text-zinc-300 pt-2 border-t border-rose-900/40">
                  Recommended Action: <span className="font-bold text-white">Manual Finance Audit Required</span>.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Investigation Timeline & Conclusion (Section 27) */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-zinc-300" />
                <h3 className="text-sm font-semibold text-white">AI Controller Investigation</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                Pydantic Validated
              </span>
            </div>

            {/* Step-by-step Investigation Trace (Section 27) */}
            <div className="space-y-2 font-mono text-xs text-zinc-400">
              <div className="flex items-center space-x-2 text-zinc-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Retrieved linked invoice INV-1022 (₹31,800)</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Retrieved processor settlement SET-5521 (₹31,750)</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Retrieved bank deposit BANK-88421 (₹31,750)</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Evaluated ₹50 difference against standard 0.15% fee bracket</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Settlement delay within 2 business days tolerance</span>
              </div>
            </div>

            {/* AI Conclusion Box */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400">AI Conclusion</span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {isUnresolvedExample ? "Unidentified Bank Deposit" : "Legitimate Payment Gateway Fee"}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] uppercase text-zinc-400">Confidence</span>
                  <div className={`text-base font-bold ${isUnresolvedExample ? "text-rose-400" : "text-emerald-400"}`}>
                    {isUnresolvedExample ? "38%" : "94%"}
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {isUnresolvedExample
                  ? "CLOSE evaluated 4 connected sources and refused to make a decision without proof. Escalate to treasury for offline bank verification."
                  : "The processor settlement is lower than the customer invoice by exactly ₹50, while transaction references and dates align. Classify ₹50 as processor fee."}
              </p>
            </div>

            {/* Human Approval Action Deck (Section 29) */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-3">
              <div className="text-xs font-semibold text-zinc-200">Human Approval Action</div>

              {approved && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs font-mono text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Approved by Senior Controller. Reclassified ₹50 as fee. Audit event recorded.</span>
                </div>
              )}

              {rejected && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-xs font-mono text-rose-300 flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Recommendation rejected. Transaction flagged for manual investigation.</span>
                </div>
              )}

              {!approved && !rejected && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Optional approval note or reason (recorded in audit log)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono outline-none focus:border-zinc-600"
                  />

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleApprove}
                      className="flex-1 py-2 px-3 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Resolution</span>
                    </button>

                    <button
                      onClick={handleReject}
                      className="py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs transition-colors"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => setRejected(true)}
                      className="py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-800 text-zinc-400 hover:text-rose-400 font-mono text-xs transition-colors"
                    >
                      Mark Unresolved
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
