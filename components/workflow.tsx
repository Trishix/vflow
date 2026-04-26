"use client";

import { useWorkflowStore, type WorkflowState } from "@/lib/workflow-store";
import { Background, BackgroundVariant, Controls, ReactFlow, ReactFlowProps, SelectionMode, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Logo from "./logo";
import { AiNode } from "./nodes/ai-node";
import { AnnotationNode } from "./nodes/annotation-node";
import { MarkdownNode } from "./nodes/markdown-node";
import { PromptNode } from "./nodes/prompt-node";
import { Panels } from "./panels";
import { SidebarTrigger } from "./ui/sidebar";
import { useIsMobile } from '@/hooks/use-mobile';

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
        <div className="w-full h-full flex items-center justify-center">
        <SidebarTrigger className="absolute top-6 left-6 hover:bg-white/10 rounded-full bg-background/50 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/10 p-2 h-10 w-10 flex items-center justify-center transition-all" />
        <div className="text-center flex flex-col items-center gap-2">
          <Logo className="text-5xl sm:text-6xl" />
          <p className="text-foreground font-semibold text-2xl tracking-tight">No workflow selected</p>
          <p className="text-sm text-muted-foreground">Create a workflow from the sidebar to get started</p>
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
        padding: 0.1,
        maxZoom: 1,
        minZoom: 0.3,
      }}
      proOptions={{ hideAttribution: true }}
      {...controlSettings}
    >
      <Background color="var(--color-primary)" gap={24} size={1} variant={BackgroundVariant.Dots} className="opacity-20" style={{ backgroundColor: "transparent" }} />
      <Controls className="opacity-80 hover:opacity-100 transition-opacity" />
      <Panels />
    </ReactFlow>
  );
}
