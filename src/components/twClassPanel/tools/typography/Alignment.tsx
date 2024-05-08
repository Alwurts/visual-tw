import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

import { ITailwindClassClassified } from "@/types/tailwind";
import { TWindowTabs } from "@/types/EditorManager";
import { ToggleButtonGroup } from "../../components/ToggleButtonGroup";

interface AlignmentProps {
  currentTWClass?: ITailwindClassClassified;
  usedBy: TWindowTabs;
}

export function Alignment({ currentTWClass, usedBy }: AlignmentProps) {
  return (
    <ToggleButtonGroup
      currentTWClass={currentTWClass}
      usedBy={usedBy}
      groupItems={[
        {
          icon: <AlignLeft />,
          value: "text-left",
          "aria-label": "Toggle align left",
        },
        {
          icon: <AlignCenter />,
          value: "text-center",
          "aria-label": "Toggle align center",
        },
        {
          icon: <AlignRight />,
          value: "text-right",
          "aria-label": "Toggle align right",
        },
        {
          icon: <AlignJustify />,
          value: "text-justify",
          "aria-label": "Toggle align justify",
        },
      ]}
    />
  );
}
