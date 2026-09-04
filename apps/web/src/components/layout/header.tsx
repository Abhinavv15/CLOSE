"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Shield, ChevronDown, Check, Menu, Compass, Sun, Moon, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useTour } from "@/lib/tour-context";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startTour, isTourActive } = useTour();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-1.5 -ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company & Close Cycle Indicator */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <span className="text-xs font-semibold text-zinc-200 truncate max-w-[110px] sm:max-w-[180px] md:max-w-none">
            {user.company}
          </span>
          <span className="text-zinc-600 text-xs hidden sm:inline">/</span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-1.5 sm:px-2 py-0.5 rounded border border-zinc-800 shrink-0">
            Sep 2026
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Interactive Guided Tour Button */}
        <button
          onClick={() => startTour(0)}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-900 text-xs font-mono text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-200 transition-all shadow-sm font-semibold"
          title="Launch Step-by-Step Guided Product Walkthrough"
        >
          <Compass className={`w-3.5 h-3.5 text-zinc-300 shrink-0 ${isTourActive ? "animate-spin" : ""}`} />
          <span>{isTourActive ? "Resume Tour" : "Guided Tour"}</span>
        </button>
        {/* Search / Command trigger */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
            });
            window.dispatchEvent(event);
          }}
          className="flex items-center space-x-2 px-2 sm:px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="hidden md:inline">Search transactions & commands</span>
          <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* Engine status pill (hidden on small mobile) */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-zinc-400">ENGINE:</span>
          <span className="text-zinc-200">ONLINE</span>
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors flex items-center justify-center shrink-0"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {/* Company Workspace Profile & Organization Info */}
        <div className="relative pl-1 sm:pl-2 border-l border-zinc-800" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors text-left cursor-pointer"
            aria-label="View Company Workspace Info"
            title="Company Organization Workspace"
          >
            <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 flex items-center justify-center text-xs font-semibold shrink-0">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-zinc-200 leading-none truncate max-w-[140px]">{user.company}</span>
              <span className="text-[10px] font-mono text-emerald-400 leading-tight mt-0.5 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>Enterprise Active</span>
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
              <div className="flex items-start space-x-3 pb-3 border-b border-zinc-800/80">
                <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{user.company}</div>
                  <div className="text-[10px] font-mono text-zinc-400">{user.legalEntity}</div>
                  <span className="inline-block font-mono text-[9px] px-1.5 py-0.5 rounded mt-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                    SOC-2 Type II Certified
                  </span>
                </div>
              </div>

              <div className="py-2.5 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Workspace:</span>
                  <span className="text-zinc-200 font-sans font-medium">{user.name}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Jurisdiction:</span>
                  <span className="text-zinc-200">US (SEC Regulated)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Base Currency:</span>
                  <span className="text-zinc-200">{user.currency}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Fiscal Period:</span>
                  <span className="text-emerald-400 font-bold">Sep 2026 (Open)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Engine:</span>
                  <span className="text-zinc-200">5-Pass Deterministic</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Autonomous Controller</span>
                <span className="text-emerald-400 font-mono text-[10px]">ALL PERMISSIONS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
