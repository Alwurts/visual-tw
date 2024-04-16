import { Code2Icon, FolderTree } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonHTMLAttributes, cloneElement } from "react";
import { cn } from "@/lib/utils";

export default function SideNavigation() {
  return (
    <div className="flex w-12 flex-col items-stretch bg-editor-gray-light">
      <NavigationButton icon={<FolderTree />} text="Explorer" active />
      <NavigationButton icon={<Code2Icon />} text="Code" />
    </div>
  );
}

function NavigationButton({
  icon,
  text,
  active,
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
    >
      {Icon}
      <span className="sr-only">{text}</span>
    </Button>
  );
}
