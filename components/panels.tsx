"use client";

import { Button } from "@/components/ui/button";
import { useWorkflowStore, type WorkflowState, getCleanedWorkflow } from "@/lib/workflow-store";
import { Panel, useReactFlow } from "@xyflow/react";
import {
  ArrowDownToLine,
  Bot,
  FileText,
  Play,
  SquareStack,
  StickyNote,
  Trash2,
} from "lucide-react";
import { memo, useCallback } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export const Panels = memo(function Panels() {
  return (
    <>
      <WorkflowActionsPanel />
      <BottomNodeDock />
    </>
  );
});

const WorkflowActionsPanel = memo(function WorkflowActionsPanel() {
  const { currentWorkflowId, deleteWorkflow, getCurrentWorkflow, abortAllOperations, runWorkflow, isRunning } = useWorkflowStore(
    useShallow((state: WorkflowState) => ({
      currentWorkflowId: state.currentWorkflowId,
      deleteWorkflow: state.deleteWorkflow,
      getCurrentWorkflow: state.getCurrentWorkflow,
      abortAllOperations: state.abortAllOperations,
      runWorkflow: state.runWorkflow,
      isRunning: state.getNodes().some((node) => node.data.loading),
    }))
  );

  const handleDeleteWorkflow = useCallback(() => {
    if (currentWorkflowId && confirm("Delete this workflow? This cannot be undone.")) {
      deleteWorkflow(currentWorkflowId);
    }
  }, [currentWorkflowId, deleteWorkflow]);

  const handleExportToClipboard = useCallback(() => {
    const workflow = getCurrentWorkflow();
    if (workflow) {
      navigator.clipboard.writeText(JSON.stringify(getCleanedWorkflow(workflow), null, 2));
      toast.success("Workflow copied");
    }
  }, [getCurrentWorkflow]);

  if (!currentWorkflowId) return null;

  return (
    <Panel position="top-right" className="pointer-events-auto pr-4 pt-4">
      <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/90 p-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={runWorkflow}
          className="gap-2 rounded-full px-4 text-sky-600 hover:bg-sky-500/10 hover:text-sky-700"
          disabled={isRunning}
        >
          <Play className="h-4 w-4" />
          <span className="hidden sm:inline">Run workflow</span>
        </Button>
        {isRunning && (
          <Button
            variant="ghost"
            size="sm"
            onClick={abortAllOperations}
            className="gap-2 rounded-full px-4 text-red-600 hover:bg-red-500/10 hover:text-red-700"
          >
            <span className="hidden sm:inline">Stop</span>
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleExportToClipboard} className="gap-2 rounded-full px-4">
          <ArrowDownToLine className="h-4 w-4" />
          <span className="hidden sm:inline">Export JSON</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteWorkflow}
          className="gap-2 rounded-full px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </Panel>
  );
});

const BottomNodeDock = memo(function BottomNodeDock() {
  const instance = useReactFlow();
  const addNode = useWorkflowStore((state: WorkflowState) => state.addNode);

  const handleAddNode = useCallback(
    (type: string) => {
      const position = instance.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });

      switch (type) {
        case "prompt":
          addNode({ data: { prompt: "" }, position, height: 500, width: 450, type });
          break;
        case "ai":
          addNode({ data: { systemPrompt: "" }, position, height: 500, width: 450, type });
          break;
        case "markdown":
          addNode({ data: {}, position, height: 500, width: 450, type });
          break;
        case "annotation":
          addNode({ data: { text: "" }, position, height: 180, width: 420, type });
          break;
      }
    },
    [addNode, instance]
  );

  return (
    <Panel position="bottom-center" className="mb-4">
      <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-2 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <Button
          variant="ghost"
          onClick={() => handleAddNode("prompt")}
          className="gap-2 rounded-full px-3 sm:px-4 text-sm font-medium hover:bg-primary/10 hover:text-primary"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Prompt</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleAddNode("ai")}
          className="gap-2 rounded-full px-3 sm:px-4 text-sm font-medium hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-300"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">AI</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleAddNode("markdown")}
          className="gap-2 rounded-full px-3 sm:px-4 text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          <SquareStack className="h-4 w-4" />
          <span className="hidden sm:inline">Markdown</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleAddNode("annotation")}
          className="gap-2 rounded-full px-3 sm:px-4 text-sm font-medium hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300"
        >
          <StickyNote className="h-4 w-4" />
          <span className="hidden sm:inline">Note</span>
        </Button>
      </div>
    </Panel>
  );
});
