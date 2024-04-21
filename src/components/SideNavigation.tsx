import { Code2Icon, FolderTree, Palette } from "lucide-react";
import { Button } from "./ui/button";
import React, { ButtonHTMLAttributes, cloneElement } from "react";
import { cn } from "@/lib/utils";
import { TWindowTabs } from "@/types/EditorManager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SideNavigationProps {
  openTabs: {
    [K in TWindowTabs]: boolean;
  };
  setOpenTabs: React.Dispatch<
    React.SetStateAction<{
      [K in TWindowTabs]: boolean;
    }>
  >;
}

export default function SideNavigation({
  openTabs,
  setOpenTabs,
}: SideNavigationProps) {
  return (
    <div className="flex w-12 flex-col items-stretch bg-editor-gray-light">
      <NavigationButton
        onClick={() =>
          setOpenTabs((prev) => ({ ...prev, explorer: !prev.explorer }))
        }
        icon={<FolderTree />}
        text="Explorer"
        active={openTabs.explorer}
      />
      <NavigationButton
        onClick={() => setOpenTabs((prev) => ({ ...prev, code: !prev.code }))}
        icon={<Code2Icon />}
        text="Code"
        active={openTabs.code}
      />
      <NavigationButton
        onClick={() =>
          setOpenTabs((prev) => ({ ...prev, attributes: !prev.attributes }))
        }
        icon={<Palette />}
        text="Attributes"
        active={openTabs.attributes}
      />
    </div>
  );
}

function NavigationButton({
  icon,
  text,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  const Icon = cloneElement(icon as React.ReactElement, {
    className: "h-6 w-6 flex-shrink-0 ",
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "rounded-none py-2 dark:bg-editor-gray-light dark:text-stone-400 dark:hover:bg-editor-gray-light dark:hover:text-stone-100",
              active && "border-l-2 border-l-white text-stone-50",
            )}
            {...props}
          >
            {Icon}
            <span className="sr-only">{text}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs">{text}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
