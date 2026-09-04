"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  Clock, 
  User, 
  Cpu, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from "lucide-react";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");

  const auditEvents = [
    {
      id: "AUD-991",
      timestamp: "2026-09-04 10:33:02",
      actor: "Senior Controller (Abhinav V)",
      action: "HUMAN_APPROVAL_RECORDED",
      entity: "EX-102",
      details: "Approved ₹50 classification as Stripe processing fee. Ledger updated.",
      confidence: "94%",
      status: "VERIFIED"
    },
    {
      id: "AUD-990",
      timestamp: "2026-09-04 10:32:16",
      actor: "AI Controller Agent",
      action: "RECOMMENDATION_GENERATED",
      entity: "EX-102",
      details: "Diagnosed PROCESSOR_FEE with supporting invoice INV-1022 and settlement SET-5521.",
      confidence: "94%",
      status: "AI_GENERATED"
    },
    {
      id: "AUD-989",
      timestamp: "2026-09-04 10:32:15",
      actor: "Reconciliation Engine",
      action: "EVIDENCE_LINKED",
      entity: "SET-5521",
      details: "Retrieved settlement SET-5521 from PostgreSQL with fee breakdown ₹50.",
      confidence: "100%",
      status: "SYSTEM"
    },
    {
      id: "AUD-988",
      timestamp: "2026-09-04 10:32:15",
      actor: "Reconciliation Engine",
      action: "EVIDENCE_LINKED",
      entity: "INV-1022",
      details: "Retrieved invoice INV-1022 from PostgreSQL with gross ₹31,800.",
      confidence: "100%",
      status: "SYSTEM"
    },
    {
      id: "AUD-987",
      timestamp: "2026-09-04 10:32:14",
      actor: "Reconciliation Engine",
      action: "INVESTIGATION_STARTED",
      entity: "EX-102",
      details: "Dispatched exception EX-102 to AI investigation agent.",
      confidence: "—",
      status: "SYSTEM"
    },
    {
      id: "AUD-986",
      timestamp: "2026-09-04 10:32:01",
      actor: "Reconciliation Engine",
      action: "RECONCILIATION_RUN_COMPLETED",
      entity: "BATCH-2026-09-DEMO",
      details: "127 records processed in 1.4s. 120 matched, 7 exceptions.",
      confidence: "94.5%",
      status: "SYSTEM"
    },
  ];

  const filtered = auditEvents.filter((e) =>
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.entity.toLowerCase().includes(search.toLowerCase()) ||
    e.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Immutable Audit Trail</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
              Append-Only
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete cryptographic log of deterministic matches, evidence queries, AI conclusions, and human approvals.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-zinc-600 font-mono"
          />
        </div>
      </div>

      {/* Audit Log Table (Section 30) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">{item.timestamp}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1.5 text-zinc-200 font-medium">
                    {item.actor.includes("AI") ? (
                      <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                    ) : item.actor.includes("Human") || item.actor.includes("Controller") ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                    <span>{item.actor}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-white">{item.action}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px]">
                    {item.entity}
                  </span>
                </td>
                <td className="py-3 px-4 text-zinc-300 max-w-xs">{item.details}</td>
                <td className="py-3 px-4 font-tabular text-zinc-300">{item.confidence}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    item.status === "VERIFIED"
                      ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300"
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
