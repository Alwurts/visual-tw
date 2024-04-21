import { useEffect, useMemo, useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorManager } from "@/hooks/useEditorManager";
import {
  EditorNotification,
  isNotificationElementSelected,
} from "@/types/EditorManager";
import ZoomSelect from "./ZoomSelect";

const CodeViewer = () => {
  const iframeContainerRef = useRef(null); // New ref for iframe's parent container

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
    const viewerMessage = ({
      data: notification,
    }: MessageEvent<EditorNotification>) => {
      if (isNotificationElementSelected(notification)) {
        selectElement(notification.data.uuid);
      }
    };

    window.addEventListener("message", viewerMessage);
    return () => {
      window.removeEventListener("message", viewerMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Display</h2>
        <div className="flex items-center space-x-1">
          <ZoomSelect handleZoomChange={setZoom} zoom={zoom} />
          <Button
            size="tool"
            variant="tool"
            onClick={() => handleScreenSizeChange("mobile")}
          >
            <Smartphone className="h-4 w-4 flex-shrink-0" />
          </Button>
          <Button
            size="tool"
            variant="tool"
            onClick={() => handleScreenSizeChange("tablet")}
          >
            <Tablet className="h-4 w-4 flex-shrink-0" />
          </Button>
          <Button
            size="tool"
            variant="tool"
            onClick={() => handleScreenSizeChange("desktop")}
          >
            <Laptop className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div
        className="h-full w-full flex-grow overflow-auto scrollbar scrollbar-thumb-neutral-700"
        ref={iframeContainerRef}
      >
        <iframe
          title="Rendered Output"
          className={cn(
            "m-auto rounded-xl border-2 border-black bg-white",
            screenSizes[screenSize],
          )}
          srcDoc={srcDoc}
          style={{
            transform: `scale(${derivedZoom})`,
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
};

export default CodeViewer;
