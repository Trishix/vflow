import { Button } from "@/components/ui/button";
import { BaseNodeData } from "@/lib/base-node";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/workflow-store";
import { Node, NodeProps, NodeResizeControl, NodeToolbar } from "@xyflow/react";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function NodeCard({
  children,
  title,
  isError,
  buttons,
  node,
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
  isError?: boolean;
  buttons?: React.ReactNode;
  node: NodeProps<Node<BaseNodeData>>;
}) {
  
  const removeNode = useWorkflowStore((state) => state.removeNode);
  const runNode = useWorkflowStore((state) => state.runNode);
  const isLoading = useMemo(() => node.data?.loading === true, [node.data]);
  const addNode = useWorkflowStore((state) => state.addNode);
  const error = useMemo(() => {
    const validatedError = z.string().safeParse(node.data?.error);
    return validatedError.success ? validatedError.data : null;
  }, [node.data]);

  const handleDuplicate = useCallback(() => {
    addNode({
      ...node,
      position: { x: node.positionAbsoluteX + 100, y: node.positionAbsoluteY + 100 },
    });
  }, [node, addNode]);

  const handleDelete = useCallback(() => {
    removeNode(node.id);
  }, [node.id, removeNode]);

  const handleRun = useCallback(() => {
    runNode(node.id, true);
  }, [node.id, runNode]);

  return (
    <div
      className={cn(
        "flex flex-col bg-card rounded-[1.25rem] shadow-[0_8px_30px_rgb(15,23,42,0.10)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] h-full transition-all text-card-foreground border border-border/70",
        isError && "border-red-500/50 dark:border-red-900/50 bg-red-50 dark:bg-red-950/90 shadow-red-500/20"
      )}
    >
      <div
        className={cn(
          "bg-muted/50 transition-colors border-b p-3 flex items-center gap-3 rounded-t-[1.15rem]",
          node.selected && "bg-accent/60",
          isLoading && "dark:bg-blue-500/20 bg-blue-100"
        )}
      >
        <div
          className={cn(
            "text-sm text-foreground/80 transition-colors",
            node.selected && "text-foreground",
            isLoading && "dark:text-white text-foreground",
            error && "text-red-600"
          )}
        >
          {title}
        </div>
        {node.data?.dirty && (
          <div
            title="This node has outdated results, run it again to refresh"
            className="size-1.5 shrink-0 -ml-1 bg-orange-500/50 rounded-full"
          ></div>
        )}
        <div className="ml-auto"></div>
        {error && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="-m-1 px-2 text-red-600" size="sm">
                  Error
                </Button>
              </TooltipTrigger>
              <TooltipContent className="whitespace-pre-wrap max-w-lg">{error}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {buttons}
        <Button
          title="Run this node"
          variant="ghost"
          className="-m-1 px-2"
          disabled={isLoading}
          size="sm"
          onClick={handleRun}
        >
          {isLoading ? "Running" : "Run"}
        </Button>
      </div>
      {node.selected && (
        <NodeResizeControl
          minWidth={300}
          minHeight={200}
          className="hover:text-foreground text-foreground/60 !border-none !bg-transparent"
        >
          <span className="text-xs uppercase tracking-wide">Resize</span>
        </NodeResizeControl>
      )}

      <NodeToolbar className="flex gap-2 items-center">
        <Button title="Duplicate this node" variant="default" size="sm" onClick={handleDuplicate}>
          Duplicate
        </Button>
        <Button title="Delete this node" variant="default" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </NodeToolbar>
      {children}
    </div>
  );
}
