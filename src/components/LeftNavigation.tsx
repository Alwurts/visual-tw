import { FolderTree, GitBranch } from "lucide-react";
import { Button } from "./ui/button";
import React, { ButtonHTMLAttributes, cloneElement } from "react";
import { cn } from "@/lib/utils";
import { TWindowTabs, WindowManager } from "@/types/editor";

interface LeftNavigationProps {
  openTabs: WindowManager["left"];
  setOpenTabs: React.Dispatch<React.SetStateAction<WindowManager>>;
}

export default function LeftNavigation({
  openTabs,
  setOpenTabs,
}: LeftNavigationProps) {
  const toggleGroupTabs: {
    icon: React.ReactNode;
    text: string;
    key: TWindowTabs;
  }[] = [
    {
      icon: <FolderTree />,
      text: "Explorer",
      key: "explorer",
    },
    {
      icon: <GitBranch />,
      text: "History",
      key: "versionControl",
    },
  ];

  return (
    <div className="flex w-12 flex-col items-stretch bg-editor-gray-light">
      {toggleGroupTabs.map(({ icon, text, key }) => (
        <NavigationButton
          key={key}
          onClick={() => {
            const isActiveTab = openTabs[key] === true;
            if (isActiveTab) {
              setOpenTabs((prev) => ({
                ...prev,
                left: { ...prev.left, [key]: false },
              }));
            } else {
              toggleGroupTabs.forEach(({ key }) => {
                setOpenTabs((prev) => ({
                  ...prev,
                  left: { ...prev.left, [key]: false },
                }));
              });
              setOpenTabs((prev) => ({
                ...prev,
                left: { ...prev.left, [key]: true },
              }));
            }
          }}
          icon={icon}
          text={text}
          active={openTabs[key] === true}
        />
      ))}
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
        "rounded-none py-2 dark:bg-editor-gray-light dark:text-stone-400 dark:hover:bg-editor-gray-light dark:hover:text-stone-100",
        active && "border-l-2 border-l-white text-stone-50",
      )}
      title={text}
      {...props}
    >
      {Icon}
      <span className="sr-only">{text}</span>
    </Button>
  );
}
