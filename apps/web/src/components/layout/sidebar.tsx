"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
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
  X,
  LogOut,
  Compass,
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
    title: "Command Center",
    items: [
      { name: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Close Lifecycle Pipeline",
    items: [
      { name: "Step 1 • Ingest Statements", href: "/batches", icon: Layers, badge: "127" },
      { name: "Step 2 • 5-Pass Matching", href: "/reconciliation", icon: GitMerge, badge: "94.5%" },
      { name: "Step 3 • AI Exception Triage", href: "/exceptions", icon: AlertTriangle, badge: "7", badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/60" },
      { name: "Step 4 • Cash Runway", href: "/cash-position", icon: Wallet, badge: "₹18.4L" },
      { name: "Step 5 • Accuracy Benchmarks", href: "/evaluation", icon: CheckCircle2, badge: "98.7%" },
      { name: "Step 6 • Merkle Audit Trail", href: "/audit-log", icon: FileText, badge: "SHA-256" },
    ],
  },
  {
    title: "Documentation & Controls",
    items: [
      { name: "Product Tour & CSV Spec", href: "/walkthrough", icon: Compass, badge: "GUIDE", badgeColor: "text-blue-400 bg-blue-950/50 border-blue-800/60" },
      { name: "System Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = async () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    await logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300 transition-all duration-300 select-none",
        // Desktop sizing
        "lg:static lg:z-30",
        collapsed ? "lg:w-16" : "lg:w-64",
        // Mobile / Tablet Slide-over Drawer
        "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Brand Header */}
      <div 
        className={cn(
          "flex h-14 items-center border-b border-zinc-800/80 transition-all",
          collapsed && !mobileOpen ? "justify-center px-2" : "justify-between px-3.5"
        )}
      >
        <Link 
          href="/dashboard" 
          onClick={handleLinkClick}
          className={cn(
            "flex items-center group",
            collapsed && !mobileOpen ? "justify-center" : "space-x-2.5 overflow-hidden"
          )}
          title="CLOSE — AI Finance Controller"
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 overflow-hidden group-hover:border-zinc-700 transition-colors shadow-sm">
            <Image src="/icon.png" alt="CLOSE Icon" width={32} height={32} className="w-full h-full object-contain" />
          </div>

          {(!collapsed || mobileOpen) && (
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

        <div className="flex items-center space-x-1">
          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar menu"
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Floating Border Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:flex absolute -right-3 top-4 z-40 h-6 w-6 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-500 transition-all shadow-md cursor-pointer"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {(!collapsed || mobileOpen) && (
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
                  onClick={handleLinkClick}
                  title={collapsed && !mobileOpen ? item.name : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-xs font-medium transition-all group relative",
                    collapsed && !mobileOpen ? "justify-center h-9 w-9 mx-auto px-0" : "px-2.5 py-2",
                    isActive
                      ? "bg-zinc-800/90 text-white font-semibold shadow-sm border border-zinc-700/60"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")} />

                  {(!collapsed || mobileOpen) && (
                    <div className="flex flex-1 items-center justify-between ml-2.5 overflow-hidden">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded border",
                            item.badgeColor || "text-zinc-400 bg-zinc-900 border-zinc-800"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Info & Sign Out */}
      {(!collapsed || mobileOpen) ? (
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 text-[11px] font-mono text-zinc-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-semibold">ENGINE:</span>
            <span className="flex items-center space-x-1.5 text-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>ONLINE</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 border border-zinc-800/80 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Exit</span>
          </button>
        </div>
      ) : (
        <div className="p-2 border-t border-zinc-800/80 bg-zinc-950 flex flex-col items-center justify-center py-2.5 space-y-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" title="Engine Online · 18,4 Numeric" />
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
}
