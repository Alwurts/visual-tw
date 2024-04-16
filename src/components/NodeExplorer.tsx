import { editorManager } from "@/lib/editor/EditorManager";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DefaultTreeAdapterMap } from "parse5";
import { Separator } from "./ui/separator";
import type { EditorNotification } from "@/types/EditorManager";
import { getElementAttribute } from "@/lib/dom";

export default function NodeExplorer() {
  const [dom, setDom] = useState<DefaultTreeAdapterMap["node"][] | null>(null);
  useEffect(() => {
    const updateTreeExplorer = (notification: EditorNotification): void => {
      if (notification.type === "code-update") {
        const bodyNode = editorManager.getElementByTagName("body")[0];
        if ("childNodes" in bodyNode === false) return;
        const bodyChilds = bodyNode.childNodes;
        setDom(bodyChilds);
      }
    };

    editorManager.subscribe(updateTreeExplorer);
    return () => {
      editorManager.unsubscribe(updateTreeExplorer);
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-editor-gray-dark">
      <div className="p-3">
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
}: {
  node: DefaultTreeAdapterMap["node"];
  level: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          style={{
            paddingLeft: `${level * 11}px`,
          }}
          className="flex h-full w-full justify-start space-x-1 rounded-none p-0 text-sm font-normal text-white hover:bg-editor-gray-medium hover:text-white"
          onMouseOver={() => {
            const elementUuid = getElementAttribute(node, "visual-tw-id");
            if (elementUuid) {
              editorManager.selectElement(elementUuid);
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
                />
              );
          })}
      </CollapsibleContent>
    </Collapsible>
  );
}
