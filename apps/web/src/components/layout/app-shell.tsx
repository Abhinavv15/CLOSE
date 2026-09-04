"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthProvider } from "@/lib/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
        <CommandPalette />
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-zinc-950/95 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

