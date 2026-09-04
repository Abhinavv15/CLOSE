"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs select-none">
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Redirecting to Corporate Finance Controller...</span>
      </div>
    </div>
  );
}

