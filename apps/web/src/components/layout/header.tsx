"use client";

import React from "react";
import { Search, Bell, Shield, Terminal, ArrowUpRight } from "lucide-react";

export function Header() {
  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between z-20">
      <div className="flex items-center space-x-3">
        {/* Company & Close Cycle Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-zinc-200">Demo Technologies Pvt Ltd</span>
          <span className="text-zinc-600 text-xs">/</span>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            Sep 2026 Close
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Search / Command trigger */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
            });
            window.dispatchEvent(event);
          }}
          className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <span className="hidden sm:inline">Search transactions & commands</span>
          <kbd className="hidden sm:inline font-mono text-[10px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            ⌘K
          </kbd>
        </button>

        {/* Engine status pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-zinc-400">ENGINE:</span>
          <span className="text-zinc-200">ONLINE</span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
          <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">
            FC
          </div>
        </div>
      </div>
    </header>
  );
}
