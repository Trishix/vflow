"use client";

import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center font-black tracking-tight", className)}>
      VFLOW
    </span>
  );
}
