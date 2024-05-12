import { useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Node } from "node_modules/parse5/dist/tree-adapters/default";
import { Separator } from "./ui/separator";
import { getElementVisualTwId, getElementsByTagName } from "@/lib/dom";
import { cn } from "@/lib/utils";
import { useEditorManager } from "@/hooks/useEditorManager";
import InsertHTMLElementButton from "./buttons/InsertHTMLElementButton";

export default function NodeExplorer({ className }: { className?: string }) {
  const domExplorer = useEditorManager(({ dom }) => {
    if (!dom) return;
    const bodyNode = getElementsByTagName(dom, "body")[0];
    if ("childNodes" in bodyNode === true) {
      const bodyChilds = bodyNode.childNodes;
      return bodyChilds;
    }
  });

  return (
    <div className={cn("flex h-full flex-col bg-editor-gray-dark", className)}>
      <div className="flex h-10 items-center px-6">
        <h2 className="text-xs uppercase text-white">Explorer</h2>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div className="flex items-center justify-between space-y-1 px-3 py-1">
        <h3 className="text-xs font-semibold uppercase text-white">Document</h3>
        <InsertHTMLElementButton usedBy="explorer" />
      </div>
      {domExplorer ? (
        <div className="flex-grow overflow-y-auto scrollbar scrollbar-thumb-neutral-700">
          {domExplorer.map((node, index) => {
            if ("attrs" in node) {
              return (
                <NodeCollapsible
                  key={`${node.nodeName}-${1}-${index}`}
                  level={1}
                  node={node}
                />
              );
            }
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

function NodeCollapsible({ node, level }: { node: Node; level: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const nodeUuid = useMemo(() => getElementVisualTwId(node), [node]);

  const selectedElement = useEditorManager((state) => state.selected);

  const selectElement = useEditorManager((state) => state.selectElement);

  if ("value" in node) {
    return (
      <span
        style={{
          paddingLeft: `${level * 11}px`,
        }}
        className="text-sm font-light text-white"
      >
        {node.nodeName}
      </span>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          style={{
            paddingLeft: `${level * 11}px`,
          }}
          className={cn(
            "flex h-full w-full justify-start space-x-1 rounded-none p-0 text-sm font-normal text-white hover:text-white",
            selectedElement && selectedElement.twId === nodeUuid
              ? "bg-editor-accent dark:hover:bg-editor-accent"
              : "dark:hover:bg-editor-gray-medium",
          )}
          onClick={() => {
            if (nodeUuid) {
              selectElement(nodeUuid);
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

      {"childNodes" in node && !!node.childNodes.length && (
        <CollapsibleContent className="relative">
          <Separator
            orientation="vertical"
            style={{
              left: `${level * 12}px`,
            }}
            className="absolute z-50 dark:bg-editor-gray-light"
          />
          {node.childNodes.map((child, index) => {
            if (
              "attrs" in child ||
              (node.childNodes.length === 1 && "value" in child)
            )
              return (
                <NodeCollapsible
                  level={level + 1}
                  key={`${child.nodeName}-${level}-${index}`}
                  node={child}
                />
              );
          })}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
