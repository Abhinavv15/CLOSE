"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { ArrowRight, Lock, Mail, Shield, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("controller@democorp.internal");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  return (
    <BackgroundGrid pattern="grid" className="min-h-screen flex items-center justify-center p-6 text-zinc-100">
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="h-10 w-10 mx-auto rounded-xl bg-white text-zinc-950 font-black flex items-center justify-center text-base mb-3 shadow">
            CL
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Access CLOSE</h1>
          <p className="text-xs text-zinc-400 mt-1">Institutional Financial Control Platform</p>
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

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-zinc-900 px-3 text-[10px] font-mono uppercase text-zinc-400">
            Or Instant Hackathon Access
          </span>
        </div>

        <button
          onClick={handleDemoLogin}
          type="button"
          className="w-full py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-200 font-mono text-xs flex items-center justify-center space-x-2 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Quick Demo Access (Senior Controller)</span>
        </button>

        <div className="mt-6 text-center text-[11px] text-zinc-400 font-mono">
          <span>Protected by AES-256 and RBAC. Audit logging active.</span>
        </div>
      </div>
    </BackgroundGrid>
  );
}
