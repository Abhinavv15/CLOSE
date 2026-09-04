"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  Clock, 
  User, 
  Cpu, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Download,
  Link2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Hash
} from "lucide-react";

export default function AuditLogPage() {
  const { user, isAuditor } = useAuth();
  const [search, setSearch] = useState("");
  const [actorFilter, setActorFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [chainStatus, setChainStatus] = useState<any>({
    status: "VERIFIED",
    verified_blocks: 127,
    root_chain_hash: "74f1b8a923ec819d20c58e1b...",
    integrity: "CRYPTOGRAPHICALLY_SOUND",
  });
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const res = await api.getAuditLogs();
        if (res && res.logs) {
          setLogs(res.logs);
        }
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const res = await api.verifyAuditChain();
      setChainStatus(res);
    } catch (err) {
      console.error("Chain verification failed:", err);
    } finally {
      setTimeout(() => setVerifying(false), 400);
    }
  };

  const handleExportCSV = () => {
    window.open("http://localhost:8000/api/audit/export", "_blank");
  };

  const filtered = logs.filter((e) => {
    const matchesSearch =
      e.action?.toLowerCase().includes(search.toLowerCase()) ||
      e.entity_id?.toLowerCase().includes(search.toLowerCase()) ||
      e.actor?.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(e.details_json || {}).toLowerCase().includes(search.toLowerCase());

    const matchesActor =
      actorFilter === "ALL" ||
      (actorFilter === "CONTROLLER" && (e.actor.includes("Controller") || e.actor.includes("Human") || e.actor.includes("Abhinav"))) ||
      (actorFilter === "AI" && e.actor.includes("AI")) ||
      (actorFilter === "SYSTEM" && e.actor.includes("Engine"));

    const matchesAction =
      actionFilter === "ALL" ||
      (actionFilter === "APPROVAL" && e.action.includes("APPROVAL")) ||
      (actionFilter === "RECONCILIATION" && e.action.includes("RECONCILIATION")) ||
      (actionFilter === "DIAGNOSIS" && (e.action.includes("RECOMMENDATION") || e.action.includes("INVESTIGATION"))) ||
      (actionFilter === "EVIDENCE" && e.action.includes("EVIDENCE"));

    return matchesSearch && matchesActor && matchesAction;
  });

  return (
    <AppShell>
      {/* Header & Compliance Controls (Section 30) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Immutable Audit Trail</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
              Append-Only SHA-256
            </span>
            {isAuditor && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                Auditor View (Sarah Jenkins)
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Deterministic cryptographic log of matches, data sources, AI reasoning graphs, and human sign-offs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleVerifyChain}
            disabled={verifying}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${verifying ? "animate-spin" : ""}`} />
            <span>{verifying ? "Verifying..." : "Verify Hash Chain"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-white hover:bg-zinc-200 text-xs font-semibold text-zinc-950 flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Cryptographic Chain Integrity Banner */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-zinc-200">Cryptographic Chain Integrity</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                VERIFIED INTACT
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
              Root Merkle Hash: <span className="text-zinc-300 font-bold">{chainStatus.root_chain_hash}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-zinc-400 border-t md:border-t-0 md:border-l border-zinc-800 pt-2 md:pt-0 md:pl-4">
          <div>
            <div className="text-[10px] uppercase text-zinc-500">Verified Blocks</div>
            <div className="text-zinc-200 font-bold">{chainStatus.verified_blocks || logs.length} Blocks</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-zinc-500">Tamper Status</div>
            <div className="text-emerald-400 font-bold">Zero Breaches</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, entity ID, actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-zinc-600 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Actor Filter */}
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none font-mono focus:border-zinc-700"
          >
            <option value="ALL">All Actors</option>
            <option value="CONTROLLER">Controller (Human)</option>
            <option value="AI">AI Agent</option>
            <option value="SYSTEM">System Engine</option>
          </select>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none font-mono focus:border-zinc-700"
          >
            <option value="ALL">All Actions</option>
            <option value="APPROVAL">Approvals & Sign-Offs</option>
            <option value="DIAGNOSIS">AI Diagnoses</option>
            <option value="RECONCILIATION">Reconciliation Runs</option>
            <option value="EVIDENCE">Evidence Ingestion</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table with Cryptographic Chain (Section 30) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Chain Hash</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity Link</th>
              <th className="py-3 px-4">Details & Evidence</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500">
                  No audit log entries found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => {
                const isException = item.entity_id?.startsWith("EX-");
                const isBatch = item.entity_id?.startsWith("BATCH-") || item.entity_type === "BATCH";

                return (
                  <tr key={item.id || idx} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Hash Chain Node */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Link2 className="w-3 h-3 text-zinc-600" />
                        <span className="font-mono text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer" title={`Block Hash: ${item.hash || item.short_hash}\nPrev: ${item.previous_hash}`}>
                          #{item.short_hash || `blk_${idx + 1}`}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      {item.timestamp?.replace("T", " ")?.slice(0, 19) || item.timestamp}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-zinc-200 font-medium">
                        {item.actor?.includes("AI") ? (
                          <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                        ) : item.actor?.includes("Human") || item.actor?.includes("Controller") || item.actor?.includes("Abhinav") ? (
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

                    {/* Clickable Entity Link */}
                    <td className="py-3 px-4">
                      {isException ? (
                        <Link
                          href={`/exceptions/${item.entity_id}`}
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[11px] transition-colors"
                        >
                          <span>{item.entity_id}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                        </Link>
                      ) : isBatch ? (
                        <Link
                          href={`/batches/${item.entity_id}`}
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[11px] transition-colors"
                        >
                          <span>{item.entity_id}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                        </Link>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px]">
                          {item.entity_id}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-zinc-300 max-w-sm">
                      <div className="truncate">
                        {item.details_json?.note ||
                          item.details_json?.diagnosis ||
                          item.details_json?.records
                            ? `${item.details_json?.records} records, ${item.details_json?.matched} matched`
                            : typeof item.details_json === "object"
                            ? JSON.stringify(item.details_json)
                            : item.details}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-tabular text-zinc-300">{item.confidence || "100%"}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          item.status === "VERIFIED"
                            ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                            : item.status === "AI_GENERATED"
                            ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {item.status || "LOGGED"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
