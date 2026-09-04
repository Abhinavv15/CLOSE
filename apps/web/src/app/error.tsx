"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CLOSE application error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Ledger Interruption Detected</h2>
            <p className="text-[11px] text-zinc-400">Deterministic recovery protocol initialized.</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 break-words">
          <span className="text-zinc-500 block text-[10px] uppercase mb-1">Diagnostic Signature</span>
          {error?.message || "An unexpected error occurred during execution."}
          {error?.digest && (
            <span className="block text-[10px] text-zinc-600 mt-1">Digest: {error.digest}</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>

          <Link
            href="/dashboard"
            className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
