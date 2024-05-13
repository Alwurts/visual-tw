import { useEffect, useMemo, useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Laptop, Maximize, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorManager } from "@/hooks/useEditorManager";
import { ViewerMessage, ViewerSetOverlayShow } from "@/types/Viewer";
import ZoomSelect from "./ZoomSelect";
import { Toggle } from "./ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { receiveViewerMessage } from "@/lib/viewer";

const CodeViewer = () => {
  const iframeContainerRef = useRef(null); // New ref for iframe's parent container
  //const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeRef = useEditorManager((state) => state.viewerRef);

  const srcDoc = useEditorManager((state) => state.serializedDom);

  const selectElement = useEditorManager((state) => state.selectElement);

  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "mobile",
  );

  const screenSizes = {
    mobile: "w-[330px] h-[620px]",
    tablet: "w-[768px] h-[1024px]",
    desktop: "w-[1024px] h-[768px]",
  };

  const handleScreenSizeChange = (size: "mobile" | "tablet" | "desktop") => {
    setScreenSize(size);
  };

  const [zoom, setZoom] = useState<string>("1");

  const derivedZoom = useMemo(() => {
    const widthAndHeigthSizes = {
      mobile: { width: 330, height: 620 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1024, height: 768 },
    };
    if (zoom === "AUTO") {
      const container = iframeContainerRef.current;
      if (container) {
        const { clientWidth: containerWidth, clientHeight: containerHeight } =
          container;
        const iframeWidth = widthAndHeigthSizes[screenSize].width;
        const iframeHeight = widthAndHeigthSizes[screenSize].height;
        const zoomWidth = containerWidth / iframeWidth;
        const zoomHeight = containerHeight / iframeHeight;
        return Math.min(zoomWidth, zoomHeight).toString();
      }
    } else {
      return zoom;
    }
  }, [screenSize, zoom]);

  useEffect(() => {
    const viewerMessage = (event: MessageEvent<ViewerMessage>) => {
      receiveViewerMessage(event, (messageData) => {
        if (messageData.type === "viewer-element-selected") {
          selectElement(messageData.data.uuid);
        }
      });
    };

    window.addEventListener("message", viewerMessage);
    return () => {
      window.removeEventListener("message", viewerMessage);
    };
  }, [iframeRef, selectElement]);

  // TODO Check security around passing html content to srcDoc
  // Enable sandbox and csp

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Display</h2>
        <div className="flex items-center">
          <ZoomSelect handleZoomChange={setZoom} zoom={zoom} />
          <ToggleGroup
            type="single"
            aria-label="Screen Size"
            value={screenSize}
            className="ml-1 mr-5"
            onValueChange={(e) => {
              handleScreenSizeChange(e as "mobile" | "tablet" | "desktop");
            }}
          >
            <ToggleGroupItem
              title="Mobile"
              value="mobile"
              size="sm"
              aria-label="Mobile"
            >
              <Smartphone className="h-4 w-4 flex-shrink-0" />
            </ToggleGroupItem>
            <ToggleGroupItem
              title="Tablet"
              value="tablet"
              size="sm"
              aria-label="Tablet"
            >
              <Tablet className="h-4 w-4 flex-shrink-0" />
            </ToggleGroupItem>
            <ToggleGroupItem
              title="Desktop"
              value="desktop"
              size="sm"
              aria-label="Desktop"
            >
              <Laptop className="h-4 w-4 flex-shrink-0" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Toggle
            onPressedChange={(e) => {
              const viewer = iframeRef.current;
              const toggleOverlayMessage: ViewerSetOverlayShow = {
                type: "viewer-set-overlay-show",
                data: { newValue: e },
              };
              viewer?.contentWindow?.postMessage(toggleOverlayMessage, "*");
            }}
            size="sm"
            aria-label="Toggle bold"
          >
            <Maximize className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div
        className="h-full w-full flex-grow overflow-auto scrollbar scrollbar-thumb-neutral-700"
        ref={iframeContainerRef}
      >
        {
          <iframe
            title="Rendered Output"
            ref={iframeRef}
            className={cn(
              "m-auto rounded-xl border-2 border-black bg-white",
              screenSizes[screenSize],
              { hidden: !srcDoc },
            )}
            srcDoc={srcDoc ?? undefined}
            style={{
              transform: `scale(${derivedZoom})`,
              transformOrigin: "center",
            }}
          />
        }
        {!srcDoc && (
          <div className="flex h-full items-center justify-center text-sm text-white">
            No document loaded
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;
