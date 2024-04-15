import { editorManager } from "@/utils/editorManager/EditorManager";
import { useEffect, useState } from "react";

export default function NodeExplorer() {
  const [dom, setDom] = useState<unknown>(null);
  useEffect(() => {
    const updateTreeExplorer = (editorNotification: {
      htmlContent: string;
      dom: unknown;
    }): void => {
      console.log("dom", editorNotification.dom);
      setDom(editorNotification.dom);
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
  return (
    <div className="h-full bg-stone-500">
      <h2 className="uppercase text-white">Node Explorer</h2>
    </div>
  );
}
