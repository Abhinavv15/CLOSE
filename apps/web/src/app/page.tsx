"use client";

import React from "react";
import Image from "next/image";
import Link from "next/navigation";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { ButtonWithMovingBorder } from "@/components/ui/moving-border";
import { 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  GitMerge, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Sparkles,
  FileCheck2,
  Lock
} from "lucide-react";

export default function LandingPage() {
  return (
    <BackgroundGrid pattern="grid" className="min-h-screen text-zinc-100 selection:bg-zinc-800">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="h-8 sm:h-9 w-8 sm:w-9 rounded-xl bg-zinc-900 border border-zinc-800 p-0.5 overflow-hidden shadow-md flex items-center justify-center shrink-0">
            <Image src="/icon.png" alt="CLOSE" width={36} height={36} className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase">CLOSE</span>
            <span className="text-[10px] text-zinc-400 block font-mono -mt-0.5">AI Finance Controller</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <a
            href="/evaluation"
            className="text-xs text-zinc-400 hover:text-zinc-200 font-mono transition-colors hidden sm:inline-block"
          >
            Ground-Truth Benchmark
          </a>
          <a
            href="/login"
            className="text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 transition-all font-medium"
          >
            Sign In
          </a>
          <a
            href="/dashboard"
            className="text-xs px-3 sm:px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all shadow-sm shrink-0"
          >
            Launch Controller
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] sm:text-[11px] font-mono text-zinc-300 mb-6 sm:mb-8 backdrop-blur-md max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">Deterministic Matching + AI Investigation + Ground Truth</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 sm:mb-6">
          CLOSE
          <span className="block text-lg sm:text-2xl lg:text-3xl font-light text-zinc-400 mt-2">
            AI Finance Controller
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
          Reconcile financial records, investigate ambiguous exceptions, and forecast cash — with indisputable evidence behind every decision.
        </p>

        {/* Core Philosophy Callout (Section 2 & 68) */}
        <div className="mb-8 sm:mb-10 max-w-2xl mx-auto p-3.5 sm:p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 italic text-center">
          &ldquo;Our deterministic engine handles what can be proven. Our AI handles what requires reasoning. When neither has enough evidence, CLOSE refuses to decide.&rdquo;
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <ButtonWithMovingBorder
            borderRadius="0.75rem"
            className="px-6 py-3 font-semibold text-sm cursor-pointer"
            onClick={() => window.location.href = "/dashboard"}
          >
            <span className="flex items-center space-x-2">
              <span>Run a Demo (127 Records)</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </span>
          </ButtonWithMovingBorder>

          <a
            href="/evaluation"
            className="px-6 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-medium transition-all"
          >
            View Evaluation Metrics
          </a>
        </div>

        {/* Live Controller Benchmark Bar (Section 8) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-2xl text-left">
          <div className="p-2.5 sm:p-3 border-r border-zinc-800/60">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">Records Processed</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-white mt-1">127</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">Synthetic Batch 001</div>
          </div>
          <div className="p-2.5 sm:p-3 md:border-r border-zinc-800/60">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">Match Rate</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-emerald-400 mt-1">94.5%</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">Exact + Multi-source</div>
          </div>
          <div className="p-2.5 sm:p-3 border-r border-zinc-800/60">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">Auto-Resolution</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-white mt-1">98.7%</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">Zero Hallucinations</div>
          </div>
          <div className="p-2.5 sm:p-3">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">Unresolved Exceptions</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-amber-400 mt-1">7</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">Human Escalation</div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Core Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Built like an institutional control terminal</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <div className="p-2.5 rounded-lg bg-zinc-800/60 w-fit text-zinc-200">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Deterministic Matching First</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Amounts, reference IDs, and tolerance windows are processed with deterministic algorithms. No fuzzy LLM arithmetic.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <div className="p-2.5 rounded-lg bg-zinc-800/60 w-fit text-zinc-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Evidence-First AI Agent</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When differences arise, the AI queries transaction history and processor fees, returning structured citations and confidence scores.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <div className="p-2.5 rounded-lg bg-zinc-800/60 w-fit text-zinc-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">30-Day Forward Cash Forecast</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Calculates forward cash balance from proven receivables and liabilities, pairing the numbers with an AI-generated variance narrative.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-400 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
          <div>CLOSE — AI Finance Controller &copy; 2026. Production Grade.</div>
          <div className="flex items-center space-x-4">
            <a href="/dashboard" className="hover:text-zinc-300">Dashboard</a>
            <a href="/evaluation" className="hover:text-zinc-300">Evaluation</a>
            <a href="/audit-log" className="hover:text-zinc-300">Audit Trail</a>
          </div>
        </div>
      </footer>
    </BackgroundGrid>
  );
}
