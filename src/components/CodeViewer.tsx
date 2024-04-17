import { useEffect, useState } from "react";
import { editorManager } from "../lib/editor/EditorManager";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditorNotification } from "@/types/EditorManager";

const CodeViewer = () => {
  const [srcDoc, setSrcDoc] = useState<string>("");

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

  useEffect(() => {
    const subscription = (notification: EditorNotification): void => {
      if (notification.type === "code-update") {
        setSrcDoc(notification.data.serializedDom);
      }
    };

    editorManager.subscribe(subscription);
    return () => {
      editorManager.unsubscribe(subscription);
    };
  }, []);

  useEffect(() => {
    const relayViewerMessage = ({
      data: notification,
    }: MessageEvent<EditorNotification>) => {
      editorManager.relayMessage(notification);
    };

    window.addEventListener("message", relayViewerMessage);
    return () => {
      window.removeEventListener("message", relayViewerMessage);
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Display</h2>
        <div className="flex space-x-1">
          <Button
            size="icon"
            className="h-auto w-auto rounded-sm p-1 hover:bg-editor-accent"
            onClick={() => handleScreenSizeChange("mobile")}
          >
            <Smartphone className="h-4 w-4 flex-shrink-0" />
          </Button>
          <Button
            size="icon"
            className="h-auto w-auto rounded-sm p-1 hover:bg-editor-accent"
            onClick={() => handleScreenSizeChange("tablet")}
          >
            <Tablet className="h-4 w-4 flex-shrink-0" />
          </Button>
          <Button
            size="icon"
            className="h-auto w-auto rounded-sm p-1 hover:bg-editor-accent"
            onClick={() => handleScreenSizeChange("desktop")}
          >
            <Laptop className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div className="h-full w-full flex-grow overflow-auto scrollbar scrollbar-thumb-neutral-700">
        <iframe
          title="Rendered Output"
          className={cn(
            "m-auto rounded-xl border-2 border-black bg-white",
            screenSizes[screenSize],
          )}
          srcDoc={srcDoc}
        />
      </div>
    </div>
  );
};

export default CodeViewer;
