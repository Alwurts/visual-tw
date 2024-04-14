import { useEffect, useState } from "react";
import { editorManager } from "../utils/editorManager/EditorManager";

const CodeViewer = () => {
  const [srcDoc, setSrcDoc] = useState<string>("");

  useEffect(() => {
    const updateSrcDoc = (newHTML: string): void => {
      setSrcDoc(newHTML);
    };

    editorManager.subscribe(updateSrcDoc);
    return () => {
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
