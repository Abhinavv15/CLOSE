"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  GitMerge, 
  AlertTriangle, 
  Wallet, 
  CheckCircle, 
  FileText,
  Compass
} from "lucide-react";
import { useTour } from "@/lib/tour-context";

export interface PipelineStepConfig {
  step: number;
  name: string;
  phase: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const PIPELINE_STEPS: PipelineStepConfig[] = [
  {
    step: 1,
    name: "Ingest Statements",
    phase: "DATA INGESTION",
    path: "/batches",
    icon: Layers,
    description: "Ingest Bank, Processor, Ledger, and Invoices CSV files.",
  },
  {
    step: 2,
    name: "5-Pass Matching",
    phase: "DETERMINISTIC RECONCILIATION",
    path: "/reconciliation",
    icon: GitMerge,
    description: "Sub-100ms hash matching across 5 deterministic passes.",
  },
  {
    step: 3,
    name: "AI Exception Triage",
    phase: "AUTONOMOUS REASONING",
    path: "/exceptions",
    icon: AlertTriangle,
    description: "Autonomous AI tool investigation for anomalies and fee variances.",
  },
  {
    step: 4,
    name: "Cash Runway & Forecast",
    phase: "TREASURY & LIQUIDITY",
    path: "/cash-position",
    icon: Wallet,
    description: "30-day liquidity curve based on reconciled collections and payroll.",
  },
  {
    step: 5,
    name: "Ground-Truth Benchmarks",
    phase: "ACCURACY & VALIDATION",
    path: "/evaluation",
    icon: CheckCircle,
    description: "Empirical precision, recall, and 0.0% math hallucination scorecard.",
  },
  {
    step: 6,
    name: "Merkle Audit Trail",
    phase: "STATUTORY COMPLIANCE",
    path: "/audit-log",
    icon: FileText,
    description: "Cryptographic SHA-256 block chain and auditor verification.",
  },
];

interface PipelineStepHeaderProps {
  currentStep: number;
  subtitle?: string;
}

export function PipelineStepHeader({ currentStep, subtitle }: PipelineStepHeaderProps) {
  const { startTour } = useTour();
  const current = PIPELINE_STEPS.find((s) => s.step === currentStep) || PIPELINE_STEPS[0];
  const prev = PIPELINE_STEPS.find((s) => s.step === currentStep - 1);
  const next = PIPELINE_STEPS.find((s) => s.step === currentStep + 1);

  return (
    <div className="mb-6 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md shadow-lg font-mono text-xs">
      {/* Top Lifecycle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-400 border border-blue-800/80 uppercase tracking-wider">
            STEP {current.step} OF 6 IN CLOSE LIFECYCLE
          </span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-[11px] text-zinc-400 uppercase font-semibold">
            {current.phase}
          </span>
        </div>

        <button
          onClick={() => startTour(current.step)}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-700/60 text-blue-300 hover:text-white transition-colors text-[11px]"
          title="Open interactive popup guide for this step"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Explain Step {current.step} (Popup Guide)</span>
        </button>
      </div>

      {/* 6-Step Horizontal Pipeline Flow */}
      <div className="py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-2 min-w-[700px]">
          {PIPELINE_STEPS.map((s, idx) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            const Icon = s.icon;

            return (
              <React.Fragment key={s.step}>
                <Link
                  href={s.path}
                  className={`flex-1 flex items-center space-x-2 p-2 rounded-xl border transition-all text-left group ${
                    isCurrent
                      ? "bg-zinc-800/90 border-blue-500/80 shadow-md ring-1 ring-blue-500/30 text-white"
                      : isCompleted
                      ? "bg-zinc-900/40 border-emerald-900/50 text-zinc-300 hover:bg-zinc-900 hover:border-emerald-700/60"
                      : "bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-300"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border shrink-0 ${
                    isCurrent
                      ? "bg-blue-600 text-white border-blue-400"
                      : isCompleted
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-zinc-400 uppercase font-mono">
                        Step {s.step}
                      </span>
                      {isCurrent && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="font-bold text-[11px] truncate mt-0.5">
                      {s.name}
                    </div>
                  </div>
                </Link>

                {idx < PIPELINE_STEPS.length - 1 && (
                  <div className="text-zinc-700 font-mono text-xs select-none">
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Bottom Step Breadcrumb and Before / Next Buttons */}
      <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
        <div>
          {prev ? (
            <Link
              href={prev.path}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Before: Step {prev.step} ({prev.name})</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard Overview</span>
            </Link>
          )}
        </div>

        <span className="text-[11px] text-zinc-400 hidden sm:inline truncate text-center max-w-sm">
          {subtitle || current.description}
        </span>

        <div>
          {next ? (
            <Link
              href={next.path}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all shadow-sm group"
            >
              <span>Next: Step {next.step} ({next.name})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-sm group"
            >
              <span>Close Cycle Complete (Dashboard)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
