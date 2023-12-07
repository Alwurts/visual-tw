import { useEffect } from "react";
import { CodeBlock } from "../types/Code";

interface CodeViewerProps {
  code: string;
  codeBlockTracker: {
    [key: string]: CodeBlock;
  };
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  useEffect(() => {
    const renderIframe = document.querySelector("iframe");

    if (renderIframe) {
      renderIframe.srcdoc = code;
    }
  }, [code]);

  return (
    <div className="overflow-auto w-full bg-zinc-700">
      <div className="w-[1000px] h-[1000px] flex justify-center items-center">
        <iframe
          title="Rendered Output"
          className="w-[375px] h-[667px] border-2 border-black rounded-xl"
        />
      </div>
    </div>
  );
};

export default CodeViewer;
