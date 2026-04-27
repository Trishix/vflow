"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useWorkflowStore } from "@/lib/workflow-store";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { CirclePlus, FileDown, KeyRound, MoonStar, SunMedium } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import ApiKeys from "./api-keys";
import ImportDialog from "./import-dialog";
import Logo from "./logo";

export function AppSidebar() {
  const { setTheme,resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { createWorkflow, switchWorkflow, currentWorkflowId } = useWorkflowStore(
    useShallow((state) => ({
      createWorkflow: state.createWorkflow,
      switchWorkflow: state.switchWorkflow,
      currentWorkflowId: state.currentWorkflowId,
    }))
  );

  const serializedWorkflows = useWorkflowStore(
    useShallow((state) =>
      state.workflows
        .map((workflow) => ({
          name: workflow.name,
          id: workflow.id,
          createdAt: new Date(workflow.createdAt).toISOString(),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((workflow) => `${workflow.name}:${workflow.id}`)
    )
  );

  const workflows = useMemo(() => {
    return serializedWorkflows.map((workflow) => {
      const lastDashIndex = workflow.lastIndexOf(":");
      const name = workflow.substring(0, lastDashIndex);
      const id = workflow.substring(lastDashIndex + 1);
      return {
        name,
        id,
      };
    });
  }, [serializedWorkflows]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = workflows.map((workflow) => (
    <SidebarMenuItem key={workflow.id}>
      <SidebarMenuButton onClick={() => switchWorkflow(workflow.id)} isActive={workflow.id === currentWorkflowId}>
        <span className="truncate">{workflow.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 flex items-center">
          <Logo className="text-2xl leading-none" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>New</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => createWorkflow()} className="gap-2">
                  <CirclePlus className="h-4 w-4" />
                  New Workflow
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ImportDialog>
                  <SidebarMenuButton className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Import
                  </SidebarMenuButton>
                </ImportDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workflows</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mounted ? (
                menuItems
              ) : (
                <>
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ApiKeys>
              <SidebarMenuButton className="gap-2">
                <KeyRound className="h-4 w-4" />
                API Keys
              </SidebarMenuButton>
            </ApiKeys>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {mounted ? (
              <SidebarMenuButton
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                suppressHydrationWarning
                className="gap-2"
              >
                {resolvedTheme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </SidebarMenuButton>
            ) : (
              <SidebarMenuSkeleton />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
