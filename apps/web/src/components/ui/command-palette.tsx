"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Layers, 
  GitMerge, 
  AlertCircle, 
  Wallet, 
  CheckCircle2, 
  FileText, 
  Settings as SettingsIcon,
  Sparkles,
  X
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    { name: "Open Dashboard", icon: Layers, path: "/dashboard", section: "Navigation" },
    { name: "Run Reconciliation Batch", icon: GitMerge, path: "/reconciliation", section: "Actions" },
    { name: "View Exceptions Center", icon: AlertCircle, path: "/exceptions", section: "Operations" },
    { name: "Inspect Cash Forecast", icon: Wallet, path: "/cash-position", section: "Finance" },
    { name: "View Controller Evaluation", icon: CheckCircle2, path: "/evaluation", section: "Audit & Quality" },
    { name: "Audit Trail", icon: FileText, path: "/audit-log", section: "Operations" },
    { name: "System Settings & AI Mode", icon: SettingsIcon, path: "/settings", section: "System" },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 mr-2.5" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search transactions... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-zinc-500 text-zinc-100 font-normal"
          />
          <button 
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-800/50">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No matching commands found.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.path + cmd.name}
                    onClick={() => {
                      router.push(cmd.path);
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors group text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded bg-zinc-800/80 group-hover:bg-zinc-700 text-zinc-400 group-hover:text-zinc-200">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{cmd.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                      {cmd.section}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 bg-zinc-950/60 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-zinc-400 mr-1" />
            <span>CLOSE AI Controller 2026</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Navigate <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px]">↓</kbd></span>
            <span>Select <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px]">↵</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
}
