"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Shield, ChevronDown, Check, Eye, UserCheck, ShieldAlert, Menu, LogOut, Compass } from "lucide-react";
import { useAuth, PRESET_PERSONAS } from "@/lib/auth-context";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const router = useRouter();
  const { user, switchPersona, logout, isAuditor } = useAuth();
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

        {/* Auditor Read-Only Banner */}
        {isAuditor && (
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-400">
            <Eye className="w-3 h-3" />
            <span className="font-semibold">AUDITOR REVIEW MODE</span>
            <span className="text-amber-500/70 text-[10px]">(Read-Only)</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Walkthrough & Guide Button */}
        <Link
          href="/walkthrough"
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-blue-950/30 hover:bg-blue-900/40 border border-blue-800/60 text-xs font-mono text-blue-300 hover:text-white transition-colors"
          title="Interactive Product Tour & CSV Schema Guide"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Tour & Guide</span>
        </Link>
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

        {/* Persona Switcher Dropdown */}
        <div className="relative pl-1 sm:pl-2 border-l border-zinc-800" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1.5 sm:space-x-2 p-1 rounded-lg hover:bg-zinc-900 transition-colors text-left"
            aria-label="Switch User Persona"
          >
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border shrink-0 ${
                user.role === "AUDITOR"
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : user.role === "ADMIN"
                  ? "bg-zinc-800 border-zinc-600 text-white"
                  : "bg-zinc-900 border-zinc-700 text-emerald-300"
              }`}
            >
              {user.avatar}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-zinc-200 leading-none">{user.name}</span>
              <span className="text-[10px] font-mono text-zinc-500 leading-tight mt-0.5">{user.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
              <div className="px-2 py-1.5 mb-1 border-b border-zinc-900">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                  Switch User Persona
                </span>
              </div>

              {Object.entries(PRESET_PERSONAS).map(([key, persona]) => {
                const isActive = user.id === persona.id;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      switchPersona(key as "controller" | "auditor" | "admin");
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-start space-x-2.5 p-2 rounded-lg text-left transition-colors ${
                      isActive ? "bg-zinc-900 text-white" : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                        persona.role === "AUDITOR"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : persona.role === "ADMIN"
                          ? "bg-zinc-800 border-zinc-600 text-white"
                          : "bg-zinc-900 border-zinc-700 text-emerald-400"
                      }`}
                    >
                      {persona.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate">{persona.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 block truncate">{persona.title}</span>
                      <span
                        className={`inline-block font-mono text-[9px] px-1.5 py-0.2 rounded mt-1 border ${
                          persona.role === "AUDITOR"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : persona.role === "ADMIN"
                            ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        }`}
                      >
                        {persona.role}
                      </span>
                    </div>
                  </button>
                );
              })}

              <div className="pt-2 mt-1.5 border-t border-zinc-900">
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await logout();
                    router.push("/login");
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-xs font-mono"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
