import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ITailwindClassClassified } from "@/types/tailwind";
import { useEditorManager } from "@/hooks/useEditorManager";
import { TWindowTabs } from "@/types/editor";
import { cloneElement } from "react";

interface ToggleButtonGroupProps {
  currentTWClass?: ITailwindClassClassified;
  groupItems: {
    icon: JSX.Element;
    value: string;
    "aria-label": string;
  }[];
  usedBy: TWindowTabs;
}

export function ToggleButtonGroup({
  currentTWClass,
  usedBy,
  groupItems,
}: ToggleButtonGroupProps) {
  const changeTwClass = useEditorManager((state) => state.changeTwClass);
  const insertTwClass = useEditorManager((state) => state.insertTwClass);

  const handleToolChange = (value: string) => {
    if (currentTWClass) {
      changeTwClass(currentTWClass, value, usedBy);
    } else {
      insertTwClass(value, usedBy);
    }
  };

  return (
    <ToggleGroup type="single" className="w-fit" value={currentTWClass?.value}>
      {groupItems.map((item) => {
        const Icon = cloneElement(item.icon, {
          className: "h-4 w-4",
        });
        return (
          <ToggleGroupItem
            key={item.value}
            title={item.value}
            value={item.value}
            size="sm"
            aria-label={item["aria-label"]}
            onClick={() => handleToolChange(item.value)}
          >
            {Icon}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
