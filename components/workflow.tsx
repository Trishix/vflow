"use client";

import { useWorkflowStore, type WorkflowState } from "@/lib/workflow-store";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProps,
  SelectionMode,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { ArrowDownToLine, PanelLeft, Workflow as WorkflowIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import Logo from "./logo";
import { AiNode } from "./nodes/ai-node";
import { AnnotationNode } from "./nodes/annotation-node";
import { MarkdownNode } from "./nodes/markdown-node";
import { PromptNode } from "./nodes/prompt-node";
import { Panels } from "./panels";
import { SidebarTrigger } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

const panOnDrag = [1, 2];

const nodeTypes: NodeTypes = {
  prompt: PromptNode,
  ai: AiNode,
  markdown: MarkdownNode,
  annotation: AnnotationNode,
};

const selector = (state: WorkflowState) => ({
  nodes: state.getNodes(),
  edges: state.getEdges(),
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteWorkflow: state.deleteWorkflow,
  updateWorkflowName: state.updateWorkflowName,
  getCurrentWorkflow: state.getCurrentWorkflow,
  currentWorkflowId: state.currentWorkflowId,
  workflows: state.workflows,
  addNode: state.addNode,
  abortAllOperations: state.abortAllOperations,
  isRunning: state.getNodes().some((node) => node.data.loading),
});

export default function Workflow() {
  const { resolvedTheme } = useTheme();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, currentWorkflowId } = useWorkflowStore(
    useShallow(selector)
  );
  const isMobile = useIsMobile()
  const gridColor = resolvedTheme === "dark" ? "rgba(148, 163, 184, 0.18)" : "rgba(100, 116, 139, 0.28)";
  const accentColor = resolvedTheme === "dark" ? "rgba(148, 163, 184, 0.12)" : "rgba(71, 85, 105, 0.18)";
  const controlSettings = useMemo((): Partial<ReactFlowProps> => {
    return isMobile
      ? { panOnScroll: false, selectionOnDrag: false, panOnDrag: true }
      : {
          panOnScroll: true,
          selectionOnDrag: true,
          panOnDrag: panOnDrag,
        };
  }, [isMobile]);

  // Don't render if no current workflow
  if (!currentWorkflowId) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <SidebarTrigger className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur-md transition-colors hover:bg-accent hover:text-accent-foreground" />
        <div className="flex max-w-lg flex-col items-center gap-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/70 bg-card/90 shadow-sm backdrop-blur">
            <WorkflowIcon className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-semibold tracking-tight">No workflow selected</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Create a workflow from the sidebar, then build it from the dock below.
            </p>
          </div>
          <Button variant="outline" className="gap-2 rounded-full">
            <PanelLeft className="h-4 w-4" />
            Open sidebar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ReactFlow
      key={currentWorkflowId}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      colorMode={resolvedTheme === "dark" ? "dark" : "light"}
      className="w-full h-full animate-in fade-in-0 duration-300"
      fitView
      selectionMode={SelectionMode.Partial}
      deleteKeyCode={["Backspace", "Delete"]}
      multiSelectionKeyCode={["Shift", "Control", "Meta"]}
      minZoom={0.2}
      fitViewOptions={{
        padding: 0.18,
        maxZoom: 1,
        minZoom: 0.3,
      }}
      proOptions={{ hideAttribution: true }}
      {...controlSettings}
    >
      <Background
        color={gridColor}
        gap={32}
        size={1}
        variant={BackgroundVariant.Lines}
        style={{ backgroundColor: "transparent" }}
      />
      <Background
        color={accentColor}
        gap={96}
        size={1}
        variant={BackgroundVariant.Dots}
        style={{ backgroundColor: "transparent" }}
      />
      <Controls className="opacity-80 hover:opacity-100 transition-opacity" />
      <Panels />
    </ReactFlow>
  );
}
