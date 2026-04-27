"use client";

import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0 group select-none", className)}>
      <span className="font-sans font-black tracking-[-0.075em] text-foreground">
        V
      </span>
      <span className="font-sans font-normal tracking-[-0.025em] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        FLOW
      </span>
    </span>
  );
}
