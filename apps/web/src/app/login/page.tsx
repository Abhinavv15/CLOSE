"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { ArrowRight, Lock, Mail, Shield, CheckCircle2, UserCheck, Eye, Cog } from "lucide-react";
import { PRESET_PERSONAS } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("abhinav@democorp.internal");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const setPersonaAndNavigate = (key: string) => {
    setLoading(true);
    try {
      localStorage.setItem("close_auth_persona", key);
    } catch {
      // ignore
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonaAndNavigate("controller");
  };

  return (
    <BackgroundGrid pattern="grid" className="min-h-screen flex items-center justify-center p-3.5 sm:p-6 text-zinc-100">
      <div className="w-full max-w-lg bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative">
        <div className="text-center mb-6 sm:mb-8">
          <div className="h-14 sm:h-16 mx-auto flex items-center justify-center mb-3">
            <Image src="/logo-white.png" alt="CLOSE Logo" width={160} height={56} className="h-12 sm:h-14 w-auto object-contain drop-shadow" priority />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Access CLOSE</h1>
          <p className="text-xs text-zinc-400 mt-1">Autonomous Multi-Source AI Finance Controller</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">Security Key</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>{loading ? "Authenticating..." : "Sign In with Single Sign-On"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative my-5 sm:my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-zinc-900 px-3 text-[10px] font-mono uppercase text-zinc-400">
            Select Persona for Instant Demo Access
          </span>
        </div>

        {/* 3 Quick Persona Cards */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => setPersonaAndNavigate("controller")}
            type="button"
            className="w-full p-2.5 sm:p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                AV
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 flex items-center space-x-1.5">
                  <span className="truncate">Abhinav Verma</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">
                    CONTROLLER
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 truncate">Full Execution: Approve, Reject & Close Runner</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-200 transition-colors shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setPersonaAndNavigate("auditor")}
            type="button"
            className="w-full p-2.5 sm:p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                SJ
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 flex items-center space-x-1.5">
                  <span className="truncate">Sarah Jenkins</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded shrink-0">
                    AUDITOR
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 truncate">Read-Only: Evidence Review & Ground-Truth Audit</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-200 transition-colors shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setPersonaAndNavigate("admin")}
            type="button"
            className="w-full p-2.5 sm:p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0">
                VM
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 flex items-center space-x-1.5">
                  <span className="truncate">Vikram Malhotra</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded shrink-0">
                    ADMIN
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 truncate">Pipeline Config & Batch Ingestion</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-200 transition-colors shrink-0 ml-2" />
          </button>
        </div>

        <div className="mt-5 sm:mt-6 text-center text-[11px] text-zinc-500 font-mono">
          <span>Protected by AES-256 and RBAC. Audit logging active.</span>
        </div>
      </div>
    </BackgroundGrid>
  );
}
