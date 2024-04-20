import { editorManager } from "@/lib/editor/EditorManager";
import { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Node } from "node_modules/parse5/dist/tree-adapters/default";
import { Separator } from "./ui/separator";
import type { EditorNotification } from "@/types/EditorManager";
import { getElementAttribute } from "@/lib/dom";
import { cn } from "@/lib/utils";

export default function NodeExplorer() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const [dom, setDom] = useState<Node[] | null>(null);
  useEffect(() => {
    const updateTreeExplorer = (notification: EditorNotification): void => {
      if (notification.type === "code-update") {
        const bodyNode = editorManager.getElementByTagName("body")[0];
        if ("childNodes" in bodyNode === true) {
          const bodyChilds = bodyNode.childNodes;
          setDom(bodyChilds);
        }
      }
    };

    editorManager.subscribe(updateTreeExplorer);
    return () => {
      editorManager.unsubscribe(updateTreeExplorer);
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-editor-gray-dark">
      <div className="flex h-10 items-center px-6">
        <h2 className="text-xs uppercase text-white">Explorer</h2>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div className="px-3 py-1">
        <h3 className="text-xs font-semibold uppercase text-white">Document</h3>
      </div>
      {dom ? (
        <div className="flex-grow overflow-y-auto scrollbar scrollbar-thumb-neutral-700">
          {dom.map((node, index) => {
            if ("attrs" in node)
              return (
                <NodeCollapsible
                  key={node.nodeName + index}
                  level={1}
                  node={node}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                />
              );
          })}
        </div>
      ) : (
        <div className="flex flex-grow items-center justify-center text-sm text-white">
          <span>No document loaded</span>
        </div>
      )}
    </div>
  );
}

function NodeCollapsible({
  node,
  level,
  selectedElement,
  setSelectedElement,
}: {
  node: Node;
  level: number;
  selectedElement: string | null;
  setSelectedElement: (uuid: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const nodeUuid = useMemo(
    () => getElementAttribute(node, "visual-tw-id"),
    [node],
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          style={{
            paddingLeft: `${level * 11}px`,
          }}
          className={cn(
            selectedElement === nodeUuid
              ? "bg-editor-accent hover:bg-editor-accent"
              : "hover:bg-editor-gray-medium",
            "flex h-full w-full justify-start space-x-1 rounded-none p-0 text-sm font-normal text-white hover:text-white",
          )}
          onClick={() => {
            if (nodeUuid) {
              setSelectedElement(nodeUuid);
              editorManager.selectElement(
                "explorer-element-selected",
                nodeUuid,
              );
            }
          }}
        >
          {"childNodes" in node &&
            !!node.childNodes.length &&
            (isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ))}
          <span className="font-light">{node.nodeName}</span>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="relative">
        <Separator
          orientation="vertical"
          style={{
            left: `${level * 12}px`,
          }}
          className="absolute z-50 bg-editor-gray-light"
        />
        {"childNodes" in node &&
          !!node.childNodes.length &&
          node.childNodes.map((child, index) => {
            if ("attrs" in child || node.childNodes.length === 1)
              return (
                <NodeCollapsible
                  level={level + 1}
                  key={child.nodeName + index}
                  node={child}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                />
              );
          })}
      </CollapsibleContent>
    </Collapsible>
  );
}
