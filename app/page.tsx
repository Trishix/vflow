"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { AppSidebar } from "../components/app-sidebar";
import Workflow from "../components/workflow";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarProvider>
      {mounted ? (
        <>
          <AppSidebar />
          <main className="relative h-svh w-full overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-[40%] -left-[10%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-[120px] mix-blend-normal animate-pulse duration-10000" />
              <div className="absolute -bottom-[40%] -right-[10%] h-[70%] w-[70%] rounded-full bg-secondary/5 blur-[120px] mix-blend-normal animate-pulse duration-7000" />
            </div>
            <Workflow />
          </main>
        </>
      ) : null}
    </SidebarProvider>
  );
}
