"use client";

import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-mono">
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-zinc-800 border-t-zinc-200 animate-spin" />
        <Image src="/icon.png" alt="Loading" width={20} height={20} className="absolute h-5 w-5 object-contain rounded-full" />
      </div>


      <div className="text-center space-y-1">
        <div className="text-xs text-zinc-300 font-semibold tracking-wider uppercase">
          Querying Multi-Source Ledger
        </div>
        <div className="text-[11px] text-zinc-500">
          Syncing bank statements, processor payouts, and general ledger...
        </div>
      </div>
    </div>
  );
}
