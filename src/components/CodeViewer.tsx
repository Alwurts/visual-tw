import { useEffect, useState } from "react";
import { editorManager } from "../utils/editorManager/EditorManager";

const CodeViewer = () => {
  const [srcDoc, setSrcDoc] = useState<string>("");

  useEffect(() => {
    const updateSrcDoc = (newHTML: string): void => {
      setSrcDoc(newHTML);
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

    editorManager.subscribe(updateSrcDoc);
    return () => {
      //window.removeEventListener("message", handleMessage);
      editorManager.unsubscribe(updateSrcDoc);
    };
  }, []);

  return (
    <div className="h-full w-full overflow-auto scrollbar scrollbar-thumb-neutral-700">
      <iframe
        title="Rendered Output"
        className="m-auto h-[620px] w-[330px] rounded-xl border-2 border-black"
        srcDoc={srcDoc}
      />
    </div>
  );
};

export default CodeViewer;
