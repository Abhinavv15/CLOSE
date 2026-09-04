"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Layers,
  GitMerge,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Terminal,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Batches", href: "/batches", icon: Layers },
      { name: "Reconciliation", href: "/reconciliation", icon: GitMerge, badge: "94.5%" },
      { name: "Exceptions", href: "/exceptions", icon: AlertTriangle, badge: "7", badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/60" },
    ],
  },
  {
    title: "Finance",
    items: [
      { name: "Cash Position", href: "/cash-position", icon: Wallet, badge: "₹18.4L" },
    ],
  },
  {
    title: "Control",
    items: [
      { name: "Evaluation", href: "/evaluation", icon: CheckCircle2, badge: "98.7%" },
      { name: "Audit Log", href: "/audit-log", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300 transition-all duration-300 select-none z-30",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-3.5 border-b border-zinc-800/80">
        <Link href="/dashboard" className="flex items-center space-x-2.5 overflow-hidden group">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 overflow-hidden group-hover:border-zinc-700 transition-colors shadow-sm">
            <Image src="/icon.png" alt="CLOSE Icon" width={32} height={32} className="w-full h-full object-contain" />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs tracking-wider text-white uppercase truncate">
                CLOSE
              </span>
              <span className="text-[10px] text-zinc-400 tracking-tight truncate">
                AI Finance Controller
              </span>
            </div>
          )}
        </Link>


        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase font-mono">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center rounded-lg px-2.5 py-2 text-xs font-medium transition-all group relative",
                    isActive
                      ? "bg-zinc-800/90 text-white font-semibold shadow-sm border border-zinc-700/60"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")} />

                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between ml-2.5 overflow-hidden">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border text-zinc-300 bg-zinc-900 border-zinc-800",
                            item.badgeColor
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active bar indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-white rounded-r" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Environment Status */}
      <div className="p-2 border-t border-zinc-800/80 bg-zinc-950/40">
        {!collapsed ? (
          <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono">Sep 2026 Close</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-400 uppercase">Mock Mode</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono truncate">
              Demo Corp · INR (₹)
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Engine Online" />
          </div>
        )}
      </div>
    </aside>
  );
}
