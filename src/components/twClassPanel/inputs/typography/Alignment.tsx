import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ITailwindClass } from "@/types/tailwind/base";
import { useEditorManager } from "@/hooks/useEditorManager";

interface AlignmentProps {
  defaultClass?: ITailwindClass;
}

export function Alignment({ defaultClass }: AlignmentProps) {
  const changeTwClass = useEditorManager((state) => state.changeTwClass);

  return (
    <ToggleGroup type="single" className="w-fit" value={defaultClass?.value}>
      <ToggleGroupItem
        value="text-left"
        size="sm"
        aria-label="Toggle align left"
        onClick={(e) => {
          e.preventDefault();
          if (defaultClass) {
            changeTwClass(defaultClass, "text-left");
          }
        }}
      >
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="text-center"
        size="sm"
        aria-label="Toggle align center"
        onClick={(e) => {
          e.preventDefault();
          if (defaultClass) {
            changeTwClass(defaultClass, "text-center");
          }
        }}
      >
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="text-right"
        size="sm"
        aria-label="Toggle align right"
        onClick={(e) => {
          e.preventDefault();
          if (defaultClass) {
            changeTwClass(defaultClass, "text-right");
          }
        }}
      >
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="text-justify"
        size="sm"
        aria-label="Toggle align justify"
        onClick={(e) => {
          e.preventDefault();
          if (defaultClass) {
            changeTwClass(defaultClass, "text-justify");
          }
        }}
      >
        <AlignJustify className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
