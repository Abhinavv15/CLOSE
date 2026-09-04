"use client";

import React, { useState, useEffect, useRef } from "react";
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
  X,
  UserCheck,
  Eye,
  Shield,
  Download,
  Flame,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { switchPersona, user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = [
    // Navigation
    { name: "Command Center Dashboard", icon: Layers, path: "/dashboard", section: "Navigation" },
    { name: "Multi-Source Reconciliation Matrix", icon: GitMerge, path: "/reconciliation", section: "Navigation" },
    { name: "Exception Center Triage", icon: AlertCircle, path: "/exceptions", section: "Navigation" },
    { name: "Forward Cash Forecast & Liquidity Curve", icon: Wallet, path: "/cash-position", section: "Navigation" },
    { name: "Ground-Truth Evaluation (F1/Precision)", icon: CheckCircle2, path: "/evaluation", section: "Navigation" },
    { name: "Immutable SHA-256 Audit Trail", icon: FileText, path: "/audit-log", section: "Navigation" },
    { name: "System Settings & AI Configuration", icon: SettingsIcon, path: "/settings", section: "Navigation" },

    // Deep Links to Key Demo Records
    { name: "Inspect EX-102 (₹50 Stripe Interchange Fee Variance)", icon: AlertCircle, path: "/exceptions/EX-102", section: "Exceptions" },
    { name: "Inspect EX-108 (₹72,400 Unbacked Bank Deposit Anomaly)", icon: AlertCircle, path: "/exceptions/EX-108", section: "Exceptions" },
    { name: "Inspect BATCH-2026-09-DEMO (127 Canonical Records)", icon: GitMerge, path: "/batches/BATCH-2026-09-DEMO", section: "Batches" },

    // Persona Switching
    { 
      name: "Switch Persona: Senior Controller (Abhinav Verma)", 
      icon: UserCheck, 
      action: () => switchPersona("controller"), 
      section: "Persona Switcher" 
    },
    { 
      name: "Switch Persona: Statutory Auditor (Sarah Jenkins — Read Only)", 
      icon: Eye, 
      action: () => switchPersona("auditor"), 
      section: "Persona Switcher" 
    },
    { 
      name: "Switch Persona: VP Finance Ops & Admin (Vikram Malhotra)", 
      icon: Shield, 
      action: () => switchPersona("admin"), 
      section: "Persona Switcher" 
    },

    // Quick Compliance & Operations
    { 
      name: "Download Statutory Audit Trail Export (CSV)", 
      icon: Download, 
      action: () => window.open("http://localhost:8000/api/audit/export", "_blank"), 
      section: "Quick Actions" 
    },
    { 
      name: "Stress Test Cash Scenario A (7-Day Collection Delay)", 
      icon: Flame, 
      path: "/cash-position", 
      section: "Quick Actions" 
    },
  ];

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.section.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: typeof items[0]) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path);
    }
    setOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-100 font-mono"
      onClick={() => setOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <Search className="w-4 h-4 text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search navigation, exceptions, personas, or actions... (ESC to exit)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-transparent py-4 text-xs outline-none placeholder:text-zinc-500 text-zinc-100 font-mono"
          />
          <button 
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-mono">
              No matching commands or entities found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.name + idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-xl transition-colors group text-left ${
                      isSelected
                        ? "bg-zinc-900 text-white border border-zinc-700/80 shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-1.5 rounded-lg border ${
                        isSelected 
                          ? "bg-zinc-800 border-zinc-700 text-white" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate text-xs">{item.name}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800">
                        {item.section}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-zinc-200" : "text-transparent"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800 bg-zinc-950 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Active Persona: <strong className="text-zinc-300">{user.name}</strong> ({user.role})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Navigate <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">↑↓</kbd></span>
            <span>Select <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">↵</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
}
