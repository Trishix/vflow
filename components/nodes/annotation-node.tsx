import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { baseNodeDataSchema } from "@/lib/base-node";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/workflow-store";
import { NodeResizeControl, NodeToolbar, type NodeTypes } from "@xyflow/react";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { ErrorNode } from "./error-node";

export const annotationNodeDataSchema = baseNodeDataSchema.extend({
  text: z.string(),
});

export const AnnotationNode: NodeTypes[keyof NodeTypes] = (props) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const removeNode = useWorkflowStore((state) => state.removeNode);
  const addNode = useWorkflowStore((state) => state.addNode);
  const parsedData = useMemo(() => {
    return annotationNodeDataSchema.safeParse(props.data);
  }, [props.data]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(props.id, { text: e.target.value });
    },
    [props.id, updateNodeData]
  );

  const handleDelete = useCallback(() => {
    removeNode(props.id);
  }, [props.id, removeNode]);

  const handleDuplicate = useCallback(() => {
    addNode({
      ...props,
      position: { x: props.positionAbsoluteX + 100, y: props.positionAbsoluteY + 100 },
    });
  }, [props, addNode]);

  if (!parsedData.success) {
    return <ErrorNode title="Invalid Annotation Node Data" description={parsedData.error.message} node={props} />;
  }

  return (
    <div
      className={cn(
        "flex flex-col group rounded-xl transition-all text-card-foreground border border-transparent bg-transparent shadow-none",
        "group-hover:border-border/70 group-hover:bg-card group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
        props.selected && "border-border bg-card shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
      )}
    >
      <div
        className={cn(
          "opacity-0 bg-muted/70 group-hover:opacity-100 transition-all border-b p-3 flex items-center gap-3 rounded-t-xl",
          props.selected && " opacity-100"
        )}
      >
        <div className={cn("text-sm transition-colors text-primary")}>Annotation</div>
        <div className="ml-auto"></div>
      </div>
      <Textarea
        name="text"
        value={parsedData.data.text}
        onChange={handleTextChange}
        placeholder="Type something..."
        className="nodrag nowheel min-h-0 dark:bg-transparent nopan font-handwriting shadow-none h-full w-full resize-none rounded-xl border-none bg-transparent !ring-0 text-foreground/80 !text-2xl"
      />

      {props.selected && (
        <NodeResizeControl
          minWidth={200}
          minHeight={100}
          className="!border-none !bg-transparent text-foreground/60 hover:text-foreground"
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
    </div>
  );
};
