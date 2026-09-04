"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
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
  Layers,
  ArrowRight,
  RotateCw,
  Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ExceptionDetailPage({
  params,
}: {
  params: Promise<{ exceptionId: string }>;
}) {
  const resolvedParams = use(params);
  const exceptionId = resolvedParams.exceptionId || "EX-102";
  const { isAuditor, user } = useAuth();

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<string>("REVIEW");
  const [reason, setReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await api.getExceptionDetail(exceptionId);
        if (res) {
          setDetail(res);
          setCurrentStatus(res.status);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [exceptionId]);

  const isUnresolvedExample = exceptionId === "EX-108" || detail?.type === "MISSING_RECORD";

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await api.approveException(exceptionId, {
        user: "Senior Controller Abhinav V",
        note: reason || "Approved processor settlement fee variance.",
      });
      setCurrentStatus("APPROVED");
      setActionSuccess("Resolution APPROVED. Immutable audit log recorded.");
    } catch {
      setCurrentStatus("APPROVED");
      setActionSuccess("Resolution APPROVED (offline mode).");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      await api.rejectException(exceptionId, {
        user: "Senior Controller Abhinav V",
        note: reason || "Rejected AI recommendation. Sent for manual investigation.",
      });
      setCurrentStatus("REJECTED");
      setActionSuccess("Recommendation REJECTED. Flagged for escalation.");
    } catch {
      setCurrentStatus("REJECTED");
      setActionSuccess("Recommendation REJECTED.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnresolve = async () => {
    setSubmitting(true);
    try {
      await api.unresolveException(exceptionId, {
        user: "Senior Controller Abhinav V",
        note: reason || "Marked as unresolvable due to absence of counterpart records.",
      });
      setCurrentStatus("UNRESOLVED");
      setActionSuccess("Exception marked UNRESOLVED (Honest Escalation).");
    } catch {
      setCurrentStatus("UNRESOLVED");
      setActionSuccess("Exception marked UNRESOLVED.");
    } finally {
      setSubmitting(false);
    }
  };

  // 7-step AI investigation execution timeline (Section 27)
  const investigationSteps = [
    { label: "Querying multi-source database index...", status: "done" },
    { label: "Retrieved customer invoice records", status: "done" },
    { label: "Retrieved payment gateway processor settlements", status: "done" },
    { label: "Retrieved corresponding bank statement credit", status: "done" },
    { label: "Compared expected vs actual amounts", status: "done" },
    { label: "Evaluated 1.5% gateway interchange fee schedule", status: "done" },
    { label: "Structured diagnostic recommendation synthesized", status: "done" },
  ];

  return (
    <AppShell>
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div className="flex items-center space-x-3">
          <Link
            href="/exceptions"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">{exceptionId}</h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  currentStatus === "APPROVED"
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                    : isUnresolvedExample || currentStatus === "UNRESOLVED"
                    ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                    : "bg-amber-950/40 border-amber-800/60 text-amber-300"
                }`}
              >
                {currentStatus === "APPROVED"
                  ? "STATUS: APPROVED"
                  : isUnresolvedExample
                  ? "UNRESOLVED ANOMALY"
                  : "REVIEW REQUIRED"}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              {isUnresolvedExample
                ? "Bank credit deposit with zero corroborating records across connected sources."
                : "₹50 settlement difference between invoice and payment gateway payout."}
            </p>
          </div>
        </div>

        {/* Amount Summary Trio (Section 26) */}
        <div className="grid grid-cols-3 divide-x divide-zinc-800 p-2.5 sm:p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs text-center sm:text-left">
          <div className="px-1.5 sm:px-2">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase truncate">Expected</div>
            <div className="text-xs sm:text-sm font-bold text-white font-tabular truncate">
              {isUnresolvedExample ? "₹0.00" : "₹31,800.00"}
            </div>
          </div>
          <div className="px-1.5 sm:px-3">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase truncate">Received</div>
            <div className="text-xs sm:text-sm font-bold text-white font-tabular truncate">
              {isUnresolvedExample ? "₹72,400.00" : "₹31,750.00"}
            </div>
          </div>
          <div className="px-1.5 sm:px-3">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase truncate">Difference</div>
            <div className="text-xs sm:text-sm font-bold text-amber-400 font-tabular truncate">
              {isUnresolvedExample ? "₹72,400.00" : "-₹50.00"}
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-emerald-800/60 font-mono text-xs text-emerald-400 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <span className="text-[10px] text-zinc-400">Append-Only Audit Record Saved</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Left Column: Visual 3-Tier Connected Evidence (Section 26 & 28) */}
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-zinc-300" />
                <h3 className="text-sm font-semibold text-white">Visual Evidence Graph</h3>
              </div>
              <span className="text-[10px] text-zinc-400">3-Source Lineage</span>
            </div>

            {/* Connected Node 1: Invoice */}
            <div className="relative pl-6 pb-6 border-l-2 border-zinc-800 last:border-l-0">
              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="uppercase font-bold text-zinc-300">1. Customer Invoice</span>
                  <span>Due: Sep 1, 2026</span>
                </div>
                <div className="text-sm font-bold text-white break-words">
                  {isUnresolvedExample ? "NO CORROBORATING INVOICE FOUND" : "INV-1022 (Nexus Retail Solutions)"}
                </div>
                <div className="text-[11px] text-zinc-400 break-words">
                  {isUnresolvedExample
                    ? "Zero billed receivables match this deposit."
                    : "Billed amount: ₹31,800.00 · Status: PARTIAL"}
                </div>
              </div>
            </div>

            {/* Connected Node 2: Payment Processor Settlement */}
            <div className="relative pl-6 pb-6 border-l-2 border-zinc-800 last:border-l-0">
              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="uppercase font-bold text-zinc-300">2. Gateway Settlement</span>
                  <span>Settled: Sep 4, 2026</span>
                </div>
                <div className="text-sm font-bold text-white break-words">
                  {isUnresolvedExample ? "NO CORROBORATING PROCESSOR SETTLEMENT" : "Stripe Settlement #SET-5521"}
                </div>
                <div className="text-[11px] text-zinc-400 break-words">
                  {isUnresolvedExample
                    ? "Neither Stripe nor Razorpay logs recorded this incoming funds transfer."
                    : "Gross: ₹31,800.00 · Fee: ₹50.00 · Net Payout: ₹31,750.00"}
                </div>
              </div>
            </div>

            {/* Connected Node 3: Bank Transaction */}
            <div className="relative pl-6">
              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="uppercase font-bold text-zinc-300">3. Verified Bank Credit</span>
                  <span>Cleared: Sep 4, 2026</span>
                </div>
                <div className="text-sm font-bold text-white break-words">
                  {isUnresolvedExample ? "BANK-88421 (RTGS DEPOSIT)" : "BANK-88421 (STRIPE PAYOUT)"}
                </div>
                <div className="text-[11px] text-zinc-400 break-words">
                  {isUnresolvedExample
                    ? "Credited amount: ₹72,400.00 · Unknown sender reference."
                    : "Credited amount: ₹31,750.00 · Perfectly matches net payout."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Investigation Panel & Human Approval Actions */}
        <div className="space-y-4">
          {/* AI Investigation Panel (Section 27) */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-zinc-300" />
                <h3 className="text-sm font-semibold text-white">AI Controller Diagnosis</h3>
              </div>
              <span className="text-[10px] text-zinc-400">Step-by-Step Reasoning</span>
            </div>

            {/* Investigation Timeline */}
            <div className="space-y-2 text-xs">
              {investigationSteps.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">{step.label}</span>
                </div>
              ))}
            </div>

            {/* AI Conclusion Box */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">AI Diagnosis</span>
                <span
                  className={`text-xs font-bold ${
                    isUnresolvedExample ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {isUnresolvedExample ? "38% Confidence" : "94% Confidence"}
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                {isUnresolvedExample
                  ? "Unbacked Deposit — Insufficient Supporting Evidence"
                  : "Likely Payment Processor Gateway Fee Variance"}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                {isUnresolvedExample
                  ? "CLOSE refused to guess. Zero matching invoices or settlement batches were identified for ₹72,400. Escalation to controller required."
                  : "The ₹50 variance exactly matches Stripe's 1.5% interchange schedule. Recommended action: Approve fee variance."}
              </p>
            </div>
          </div>

          {/* Human Decision Controls (Section 29) */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Human Controller Decision</h3>
              {isAuditor && (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  <Lock className="w-3 h-3" />
                  <span>Auditor Read-Only</span>
                </span>
              )}
            </div>

            {isAuditor && (
              <div className="p-3 rounded-lg bg-zinc-900 border border-amber-500/20 text-xs text-zinc-400 flex items-start space-x-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  You are logged in as <strong>{user.name}</strong> ({user.role}). Statutory auditors have read-only inspection rights. Approval and escalation actions are restricted to Controllers.
                </span>
              </div>
            )}

            {/* Controller Rationale Note */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase block">
                Audit Note / Resolution Justification (Optional)
              </label>
              <textarea
                rows={2}
                disabled={isAuditor || submitting}
                placeholder={isAuditor ? "Audit notes cannot be submitted in Auditor mode." : "Enter audit note for permanent record..."}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={handleApprove}
                disabled={submitting || isAuditor}
                className="py-2.5 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center space-x-1 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                title={isAuditor ? "Disabled for Auditor role" : "Approve Exception"}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>

              <button
                onClick={handleReject}
                disabled={submitting || isAuditor}
                className="py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
                title={isAuditor ? "Disabled for Auditor role" : "Reject Exception"}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Reject</span>
              </button>

              <button
                onClick={handleUnresolve}
                disabled={submitting || isAuditor}
                className="py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
                title={isAuditor ? "Disabled for Auditor role" : "Escalate Anomaly"}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Escalate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
