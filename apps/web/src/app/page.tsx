"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
  Lock,
  Compass,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useTour } from "@/lib/tour-context";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { startTour } = useTour();

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
          <Link
            href="/walkthrough"
            className="text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-800/60 hover:border-blue-700 text-blue-300 hover:text-white transition-all font-mono flex items-center space-x-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Product Tour & CSV Guide</span>
          </Link>
          <a
            href="/evaluation"
            className="text-xs text-zinc-400 hover:text-zinc-200 font-mono transition-colors hidden sm:inline-block"
          >
            Ground-Truth Benchmark
          </a>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors flex items-center justify-center shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
          </button>
          <a
            href="/dashboard"
            className="text-xs px-3 sm:px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all shadow-sm shrink-0"
          >
            Launch Controller &rarr;
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

        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal">
          Deterministic 5-pass reconciliation, autonomous AI exception triage, and 30-day cash forecasting.
        </p>

        {/* Core Philosophy Callout */}
        <div className="mb-8 max-w-xl mx-auto p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 italic text-center">
          &ldquo;Our deterministic engine handles what can be proven. Our AI handles what requires reasoning. When neither has enough evidence, CLOSE refuses to decide.&rdquo;
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <ButtonWithMovingBorder
            borderRadius="0.75rem"
            className="px-6 py-3 font-semibold text-sm cursor-pointer"
            onClick={() => window.location.href = "/dashboard"}
          >
            <span className="flex items-center space-x-2">
              <span>Launch Controller (127 Records)</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </span>
          </ButtonWithMovingBorder>

          <button
            onClick={() => startTour(0)}
            className="px-5 py-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-700/60 text-blue-200 hover:text-white text-sm font-medium transition-all flex items-center space-x-2 shadow-lg"
          >
            <Compass className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Start Guided Tour</span>
          </button>

          <Link
            href="/walkthrough"
            className="px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-medium transition-all flex items-center space-x-2"
          >
            <span>Documentation</span>
          </Link>
        </div>

        {/* Live Controller Benchmark Bar (Section 8) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-2xl text-left">
          <div className="p-2.5 sm:p-3 border-r border-zinc-800/60">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">Records Processed</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-white mt-1">127</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">Across 4 Sources</div>
          </div>
          <div className="p-2.5 sm:p-3 md:border-r border-zinc-800/60">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">Deterministic Match</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-emerald-400 mt-1">94.5%</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">Sub-100ms Speed</div>
          </div>
          <div className="p-2.5 sm:p-3 border-r border-zinc-800/60">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">AI Precision</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-white mt-1">98.7%</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">0.0% Math Errors</div>
          </div>
          <div className="p-2.5 sm:p-3">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase">Honest Exceptions</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold font-tabular text-amber-400 mt-1">7</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">Refuses to Guess</div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="relative z-10 py-12 px-6 max-w-6xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Core Engine</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">Institutional Financial Control Terminal</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
            <div className="p-2 rounded-lg bg-zinc-800/60 w-fit text-zinc-200">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Deterministic 5-Pass Core</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Matches reference IDs, fees, and timing windows in 0.08s with strict Decimal precision. No arithmetic hallucinations.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
            <div className="p-2 rounded-lg bg-zinc-800/60 w-fit text-zinc-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Autonomous AI Investigator</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Investigates variances using bounded ledger and gateway search tools. Halts with honest refusal under 90% confidence.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
            <div className="p-2 rounded-lg bg-zinc-800/60 w-fit text-zinc-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Forward Cash Runway</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Projects 30-day liquidity from verified collections and scheduled bills, with automated payroll dip stress testing.
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
