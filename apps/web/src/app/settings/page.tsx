"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Sliders, 
  Key, 
  Save,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function SettingsPage() {
  const [aiMode, setAiMode] = useState<"mock" | "live">("mock");
  const [autoResolveThreshold, setAutoResolveThreshold] = useState(95);
  const [recommendThreshold, setRecommendThreshold] = useState(85);
  const [reviewThreshold, setReviewThreshold] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">System Settings & Controls</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure controller confidence thresholds, AI execution mode, and database parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-2 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saved ? "Saved Successfully" : "Save Configurations"}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Confidence Thresholds Deck (Section 24) */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-3">
            <Sliders className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-white">Confidence Thresholds</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-zinc-300 font-bold">Auto-Resolve Floor</span>
                <span className="text-emerald-400 font-bold">{autoResolveThreshold}% – 100%</span>
              </div>
              <input
                type="range"
                min="90"
                max="99"
                value={autoResolveThreshold}
                onChange={(e) => setAutoResolveThreshold(Number(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Matches above this threshold are reconciled automatically without manual approval.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-zinc-300 font-bold">Recommend + Human Approval</span>
                <span className="text-zinc-200 font-bold">{recommendThreshold}% – {autoResolveThreshold - 1}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="94"
                value={recommendThreshold}
                onChange={(e) => setRecommendThreshold(Number(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 mt-0.5">
                AI generates a recommended resolution that requires explicit senior finance approval.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-zinc-300 font-bold">Review Required</span>
                <span className="text-amber-400 font-bold">{reviewThreshold}% – {recommendThreshold - 1}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="80"
                value={reviewThreshold}
                onChange={(e) => setReviewThreshold(Number(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Flagged for manual investigation.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              <span className="text-rose-400 font-bold">Below {reviewThreshold}%</span>: Classified as <span className="text-white font-bold">UNRESOLVED</span>. The system explicitly refuses to decide without sufficient evidence.
            </div>
          </div>
        </div>

        {/* AI Mode Configuration (Section 59) */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-3">
            <Cpu className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-white">AI Controller Execution Mode</h3>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setAiMode("mock")}
              className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                aiMode === "mock"
                  ? "bg-zinc-900 border-zinc-400 shadow"
                  : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100">Deterministic Mock Mode (Offline)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-400">
                  RECOMMENDED FOR DEMO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Zero external API dependencies. Generates structured Pydantic investigation steps based on ground-truth fixtures. 100% reliable for hackathons.
              </p>
            </div>

            <div
              onClick={() => setAiMode("live")}
              className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                aiMode === "live"
                  ? "bg-zinc-900 border-zinc-400 shadow"
                  : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100">Live LLM Agent Mode</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  REQUIRES API KEY
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Calls the configured LLM API (e.g. Gemini 2.5 Pro) with structured schema validation and evidence retrieval tools.
              </p>
            </div>

            {aiMode === "live" && (
              <div className="pt-2">
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">LLM API Key</label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Database Connection Info */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-2">
            <div className="text-zinc-400 text-[10px] uppercase">Data Persistence</div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-200">SQLite Local / PostgreSQL Ready</span>
              </div>
              <span className="text-emerald-400 text-[11px]">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
