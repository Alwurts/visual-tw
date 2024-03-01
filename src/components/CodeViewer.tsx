import { useEffect, useRef } from "react";
/* import { CodeBlock } from "../types/Code"; */

interface CodeViewerProps {
  code: string;
  /* codeBlockTracker: {
    [key: string]: CodeBlock;
  }; */
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    //const renderIframe = document.querySelector("iframe");

    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) return;

    iframe.srcdoc = code;
    //iframeDoc.body.innerHTML = code;

    /* if (!iframeDoc.body) return;

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const id = target.getAttribute('re-id');
      if (id) {
        alert(`Hovered over element with id: ${id}`);
      }
    };


    iframeDoc.body.addEventListener('mouseover', handleMouseOver);

    return () => {
      iframeDoc.body.removeEventListener('mouseover', handleMouseOver);
    }; */

  }, [code]);

  return (
    <div className="overflow-auto w-full bg-zinc-700">
      <div className="w-[1000px] h-[1000px] flex justify-center items-center">
        <iframe
          title="Rendered Output"
          className="w-[375px] h-[667px] border-2 border-black rounded-xl"
          ref={iframeRef}
        />
      </div>
    </div>
  );
};

export default CodeViewer;
