"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppSidebar } from "../components/app-sidebar";

const Workflow = dynamic(() => import("../components/workflow"), { ssr: false });

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative h-svh w-full overflow-hidden bg-background text-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 58%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--primary)_8%,transparent)_0%,transparent_52%)]" />
        <Suspense fallback={null}>
          <Workflow />
        </Suspense>
      </main>
    </SidebarProvider>
  );
}
