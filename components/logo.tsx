"use client";

import { cn } from "@/lib/utils";

import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 group select-none", className)}>
      <div className="relative flex items-center justify-center translate-y-[0.02em]">
        <Image 
          src="/favicon.png" 
          alt="VFLOW Logo" 
          width={32} 
          height={32} 
          className="h-[1.25em] w-[1.25em] shrink-0 dark:mix-blend-screen opacity-95 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <span className="font-sans font-bold text-[1.55em] tracking-tight text-foreground dark:text-white/95">
        Flow
      </span>
    </span>
  );
}

