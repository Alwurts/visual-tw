import { useEditorManager } from "@/hooks/useEditorManager";
import { receiveViewerMessage, sendViewerMessage } from "@/lib/viewer";
import { ViewerMessage } from "@/types/Viewer";
import { useEffect, useState } from "react";
import { Toggle } from "../ui/toggle";
import { Maximize } from "lucide-react";

export default function ToggleOverlay() {
  const iframeRef = useEditorManager((state) => state.viewerRef);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  useEffect(() => {
    const viewerMessage = (event: MessageEvent<ViewerMessage>) => {
      receiveViewerMessage(event, ({ type }) => {
        if (type === "viewer-settings-request") {
          sendViewerMessage(iframeRef.current, {
            type: "viewer-set-overlay-show",
            data: {
              newValue: showOverlay,
            },
          });
        }
      });
    };

    window.addEventListener("message", viewerMessage);
    return () => {
      window.removeEventListener("message", viewerMessage);
    };
  }, [iframeRef, showOverlay]);

  return (
    <Toggle
      pressed={showOverlay}
      onPressedChange={(newValue) => {
        sendViewerMessage(iframeRef.current, {
          type: "viewer-set-overlay-show",
          data: { newValue },
        });
        setShowOverlay(newValue);
      }}
      size="sm"
      aria-label="Toggle bold"
    >
      <Maximize className="h-4 w-4" />
    </Toggle>
  );
}
