"use client";

import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 font-black tracking-tight", className)}>
      <span className="relative inline-flex h-[1.15em] w-[1.15em] shrink-0 items-center justify-center rounded-[0.35em] border border-border/70 bg-gradient-to-br from-foreground to-foreground/80 text-background shadow-[0_8px_20px_rgba(15,23,42,0.18)]">
        <span className="absolute left-[0.28em] top-[0.28em] h-[0.14em] w-[0.42em] rounded-full bg-background/90" />
        <span className="absolute left-[0.46em] top-[0.44em] h-[0.14em] w-[0.46em] rotate-45 rounded-full bg-background/90" />
        <span className="absolute bottom-[0.28em] right-[0.22em] h-[0.14em] w-[0.36em] rounded-full bg-background/90" />
        <span className="relative text-[0.46em] leading-none tracking-[-0.08em]">V</span>
      </span>
      <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
        VFLOW
      </span>
    </span>
  );
}
