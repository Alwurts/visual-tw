import { editorManager } from "@/lib/editor/EditorManager";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getElementsByTagName } from "@/lib/dom";
export default function NodeExplorer() {
  const [dom, setDom] = useState<unknown>(null);
  useEffect(() => {
    const updateTreeExplorer = (editorNotification: {
      htmlContent: string;
      dom: unknown;
    }): void => {
      const bodyNode = getElementsByTagName(editorNotification.dom, "body")[0];
      const bodyChild = bodyNode?.childNodes[0];
      setDom(bodyChild);
    };

    /* const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "elementhovered") {
        // Call the external code here
        const id = event.data.data;
        console.log(`Mouseover event on ${id}`);
        const element = editorManager.getNodeLocation(id);
        console.log(element);
      }
    }; */

    //window.addEventListener("message", handleMessage);

    editorManager.subscribe(updateTreeExplorer);
    return () => {
      //window.removeEventListener("message", handleMessage);
      editorManager.unsubscribe(updateTreeExplorer);
    };
  }, []);
  if (!dom) return null;
  return (
    <div className="h-full bg-editor-gray-dark text-white">
      <h2 className="uppercase">Node Explorer</h2>
      <NodeCollapsible node={dom} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NodeCollapsible({ node }: { node: any }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-full w-full justify-start space-x-1 rounded-none p-1 hover:bg-stone-300"
        >
          {!!node.childNodes &&
            (isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ))}
          <span>{node.nodeName}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full">
        <div className="flex items-stretch justify-stretch">
          <div className="h-full w-2 bg-gray-200 dark:bg-gray-700" />
          <div className="">
            {node.childNodes &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              node.childNodes.map((child: any, index: number) => (
                <NodeCollapsible key={child.nodeName + index} node={child} />
              ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
