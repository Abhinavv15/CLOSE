"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthProvider } from "@/lib/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex h-screen h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
        <CommandPalette />

        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sidebar (Desktop flex, Mobile slide-over drawer) */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Viewport */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950/95 p-3.5 sm:p-5 lg:p-6 xl:p-8">
            <div className="max-w-7xl 2xl:max-w-[1600px] w-full min-w-0 mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
