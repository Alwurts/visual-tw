import { Code2Icon, FolderTree, Palette } from "lucide-react";
import { Button } from "./ui/button";
import React, { ButtonHTMLAttributes, cloneElement } from "react";
import { cn } from "@/lib/utils";
import { TWindowTabs } from "@/types/EditorManager";

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

export default function SideNavigation({ openTabs, setOpenTabs }: SideNavigationProps) {
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
    <Button
      className={cn(
        "rounded-none bg-editor-gray-light py-2 text-stone-400 hover:bg-editor-gray-light hover:text-stone-100 dark:text-stone-900 dark:hover:text-stone-50",
        active && "border-l-2 border-l-white text-stone-50",
      )}
      {...props}
    >
      {Icon}
      <span className="sr-only">{text}</span>
    </Button>
  );
}
