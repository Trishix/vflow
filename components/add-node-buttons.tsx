import { useWorkflowStore } from '@/lib/workflow-store';
import { useReactFlow } from '@xyflow/react';
import { memo, useCallback } from 'react';
import { Button } from './ui/button';

export const AddNodeButtons = memo(AddNodeButtonsRaw);

// Component for add node buttons that uses viewport to center new nodes
function AddNodeButtonsRaw() {
  const instance = useReactFlow();
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleAddNode = useCallback(
    (type: string) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const position = instance.screenToFlowPosition({ x: screenWidth / 2, y: screenHeight / 2 });
      switch (type) {
        case "prompt":
          addNode({
            data: { prompt: "" },
            position,
            height: 500,
            width: 450,
            type: type,
          });
          break;
        case "ai":
          addNode({
            data: { systemPrompt: "" },
            position,
            height: 500,
            width: 450,
            type: type,
          });
          break;
        case "markdown":
          addNode({
            data: {},
            position,
            height: 500,
            width: 450,
            type: type,
          });
          break;
        case "annotation":
          addNode({
            data: {text: ""},
            position,
            height: 500,
            width: 450,
            type: type,
          });
          break;
      }
    },
    [addNode, instance]
  );

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => handleAddNode("prompt")}>
        Prompt
      </Button>
      <Button variant="outline" onClick={() => handleAddNode("ai")}>
        AI
      </Button>
      <Button variant="outline" onClick={() => handleAddNode("markdown")}>
        Markdown
      </Button>
      <Button variant="outline" onClick={() => handleAddNode("annotation")}>
        Annotation
      </Button>
    </div>
  );
}
