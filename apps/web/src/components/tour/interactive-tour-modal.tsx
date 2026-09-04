"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  RotateCcw,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useTour, TOUR_STEPS } from "@/lib/tour-context";

export function InteractiveTourModal() {
  const {
    isTourActive,
    currentStepIndex,
    currentStep,
    totalSteps,
    isMinimized,
    isCompleted,
    nextStep,
    prevStep,
    goToStep,
    endTour,
    toggleMinimize,
    restartTour,
  } = useTour();

  if (!isTourActive) return null;

  // Completion Screen Modal
  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
        <div className="relative w-full max-w-lg bg-zinc-950 border border-emerald-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl text-zinc-100 overflow-hidden">
          {/* Subtle glowing backdrop */}
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Guided Tour Complete</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            Full CLOSE Financial Engine Verified
          </h2>

          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            All 6 close lifecycle steps verified: multi-source ingestion, 5-pass deterministic matching, AI exception triage, cash forecasting, benchmarks, and Merkle audit.
          </p>

          <div className="my-5 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5 text-xs">
            <div className="flex items-center space-x-2 text-zinc-300 font-bold border-b border-zinc-800 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Verified System Milestones</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>4-Source Statement Ingestion</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>5-Pass Sub-100ms Matching</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Autonomous AI Tool Triage</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>30-Day Liquidity Forecast</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>96.6% Ground-Truth Precision</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Immutable Merkle Audit Log</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
            <button
              onClick={restartTour}
              className="px-3.5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-900 text-xs text-zinc-300 hover:text-white transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Tour</span>
            </button>

            <div className="flex items-center space-x-2">
              <Link
                href="/walkthrough"
                onClick={endTour}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Read Full Spec</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <button
                onClick={endTour}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
              >
                <span>Explore Freely</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimized floating badge
  if (isMinimized) {
    return (
      <aside 
        aria-label="Guided Tour Minimized Control"
        className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 p-2 px-3 rounded-xl bg-zinc-950/95 border border-zinc-700 shadow-2xl backdrop-blur-md text-zinc-100 font-mono text-xs animate-in slide-in-from-bottom-2 duration-150"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>

        <span className="font-semibold text-[11px] text-zinc-300">
          Step {currentStep.stepNumber}/{totalSteps}: {currentStep.title.slice(0, 24)}...
        </span>

        <div className="flex items-center space-x-1 border-l border-zinc-800 pl-2">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            title="Previous Step"
            aria-label="Previous Step"
            className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={nextStep}
            title="Next Step"
            aria-label="Next Step"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleMinimize}
            title="Expand Tour Card"
            aria-label="Expand Tour Card"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={endTour}
            title="Exit Tour"
            aria-label="Exit Tour"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  // Expanded Floating Tour Popup
  const nextStepInfo = TOUR_STEPS[currentStepIndex + 1];

  return (
    <aside 
      aria-label="Interactive Product Walkthrough"
      className="fixed bottom-3 sm:bottom-5 right-3 sm:right-5 z-50 w-[calc(100vw-1.5rem)] sm:w-[500px] md:w-[540px] max-h-[85vh] flex flex-col bg-zinc-950/95 border border-zinc-700/80 rounded-2xl shadow-2xl backdrop-blur-xl text-zinc-100 font-mono overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="p-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200 shrink-0">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-zinc-100 tracking-wider truncate">
            {currentStep.badge}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          <button
            onClick={toggleMinimize}
            aria-label="Minimize Tour Card"
            title="Minimize to floating pill"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={endTour}
            aria-label="Exit Tour"
            title="Exit Walkthrough"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-1 shrink-0 overflow-hidden">
        <div 
          className="bg-zinc-200 h-full transition-all duration-300"
          style={{ width: `${((currentStep.stepNumber) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
        <div>
          <div className="text-[10px] uppercase text-zinc-400 tracking-wider">
            Current Location: <span className="text-zinc-200">{currentStep.pageName}</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
            {currentStep.title}
          </h3>
        </div>

        <p className="text-zinc-300 text-xs leading-relaxed font-sans">
          {currentStep.description}
        </p>

        {/* Key Highlights */}
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center space-x-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Key Controller Capabilities</span>
          </div>
          <ul className="space-y-1.5">
            {currentStep.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-[11px] text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Tip Banner */}
        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 flex items-start space-x-2">
          <span className="text-amber-400 shrink-0 mt-0.5">💡</span>
          <span className="leading-relaxed"><strong className="text-white">Pro-Tip:</strong> {currentStep.proTip}</span>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-3 sm:px-4 sm:py-3 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-2 shrink-0">
        {/* Step Dots Selector */}
        <div className="flex items-center space-x-1.5">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToStep(idx)}
              aria-label={`Go to Step ${s.stepNumber}: ${s.title}`}
              title={`Step ${s.stepNumber}: ${s.title}`}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? "w-5 bg-white"
                  : idx < currentStepIndex
                  ? "w-2 bg-emerald-400/70"
                  : "w-2 bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>

        {/* Before and Next Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center space-x-1 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Before</span>
          </button>

          <button
            onClick={nextStep}
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-bold transition-all shadow-md flex items-center space-x-1.5 text-xs group"
          >
            <span>{nextStepInfo ? `Next: Step ${nextStepInfo.stepNumber}` : "Finish Tour"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}
