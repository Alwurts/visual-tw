import { PencilRuler } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { WindowManager } from "@/types/editor";

interface RightNavigationProps {
  openTabs: WindowManager["left"];
  setOpenTabs: React.Dispatch<React.SetStateAction<WindowManager>>;
}

export default function RightNavigation({
  openTabs,
  setOpenTabs,
}: RightNavigationProps) {
  return (
    <Button
      size="tool"
      variant="tool"
      className={cn({
        "dark:bg-editor-accent": openTabs.attributes,
        "dark:bg-editor-gray-extra-light": !openTabs.attributes,
      })}
      onClick={() =>
        setOpenTabs((prev) => ({
          ...prev,
          right: {
            ...prev.right,
            attributes: !prev.right.attributes,
          },
        }))
      }
    >
      <PencilRuler className="h-4 w-4 flex-shrink-0" />
    </Button>
  );
}
