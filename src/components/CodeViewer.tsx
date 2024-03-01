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

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
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
    <div className="overflow-auto h-full w-full scrollbar scrollbar-thumb-neutral-700">
      <iframe
        title="Rendered Output"
        className="w-[330px] h-[620px] border-2 border-black rounded-xl m-auto"
        ref={iframeRef}
      />
    </div>
  );
};

export default CodeViewer;
