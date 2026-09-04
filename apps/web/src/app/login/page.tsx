"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Database, 
  ChevronRight,
  UserPlus,
  LogIn
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, loading, error } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Pre-filled by default for Demo Technologies
  const [loginCompany, setLoginCompany] = useState("Demo Technologies Inc.");
  const [loginEmail, setLoginEmail] = useState("controller@demotechnologies.internal");
  const [loginPassword, setLoginPassword] = useState("DemoCorp@2026!");

  // Sign up fields
  const [signupCompany, setSignupCompany] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupJurisdiction, setSignupJurisdiction] = useState("US (SEC Regulated)");
  const [signupPassword, setSignupPassword] = useState("");

  const [formError, setFormError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await login({
        company: loginCompany,
        email: loginEmail,
        password: loginPassword,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setFormError(err?.message || "Failed to sign in.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!signupCompany.trim()) {
      setFormError("Company name is required.");
      return;
    }
    if (!signupEmail.trim()) {
      setFormError("Corporate email is required.");
      return;
    }
    try {
      await signup({
        company: signupCompany,
        email: signupEmail,
        legalEntity: `${signupCompany} (${signupJurisdiction})`,
        password: signupPassword,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setFormError(err?.message || "Failed to create company workspace.");
    }
  };

  const handleFillDemo = () => {
    setLoginCompany("Demo Technologies Inc.");
    setLoginEmail("controller@demotechnologies.internal");
    setLoginPassword("DemoCorp@2026!");
  };

  return (
    <BackgroundGrid pattern="grid" className="min-h-screen flex items-center justify-center p-4 sm:p-6 text-zinc-100 selection:bg-zinc-800">
      <div className="w-full max-w-lg bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-xl bg-zinc-950 border border-zinc-800 p-1 flex items-center justify-center mb-3 shadow-md">
            <Image src="/icon.png" alt="CLOSE" width={40} height={40} className="h-full w-full object-contain" priority />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white font-mono">CLOSE</h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Autonomous Multi-Source AI Finance Controller
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register Company */}
        <div className="flex rounded-xl bg-zinc-950/80 p-1 border border-zinc-800/80 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setTab("login"); setFormError(null); }}
            className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              tab === "login" 
                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab("signup"); setFormError(null); }}
            className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              tab === "signup" 
                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up Company</span>
          </button>
        </div>

        {(formError || error) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono">
            {formError || error}
          </div>
        )}

        {/* Sign In Tab */}
        {tab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
            {/* Auto-fill indicator callout */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-[11px] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pre-filled for <strong>Demo Technologies Inc.</strong></span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer font-bold shrink-0"
              >
                Reset Default
              </button>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-zinc-400 mb-1 font-semibold">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={loginCompany}
                  onChange={(e) => setLoginCompany(e.target.value)}
                  placeholder="Demo Technologies Inc."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-zinc-400 mb-1 font-semibold">Corporate Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="controller@demotechnologies.internal"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-zinc-400 mb-1 font-semibold">Master Security Key / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <span>Access {loginCompany || "Company"} Controller</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Sign Up Tab */}
        {tab === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Creates a fresh isolated corporate reconciliation environment.</span>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-zinc-400 mb-1 font-semibold">Company / Entity Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={signupCompany}
                  onChange={(e) => setSignupCompany(e.target.value)}
                  placeholder="e.g. Apex Global Technologies Corp"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-zinc-400 mb-1 font-semibold">Finance Lead Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="cfo@apexglobal.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-zinc-400 mb-1 font-semibold">Regulatory Jurisdiction</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <select
                  value={signupJurisdiction}
                  onChange={(e) => setSignupJurisdiction(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
                >
                  <option value="US (SEC Regulated)">US (SEC Regulated • US GAAP)</option>
                  <option value="EU (ESMA / IFRS)">EU (ESMA Regulated • IFRS)</option>
                  <option value="UK (FCA / UK GAAP)">UK (FCA Regulated • UK GAAP)</option>
                  <option value="India (MCA / Ind AS)">India (MCA Regulated • Ind AS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-zinc-400 mb-1 font-semibold">Master Password / Security Key</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create master security key"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <span>Initialize Company Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Deterministic 5-Pass Engine</span>
          </div>
          <span>SOC-2 Type II Certified</span>
        </div>
      </div>
    </BackgroundGrid>
  );
}
