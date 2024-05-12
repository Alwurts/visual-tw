import { ITailwindClassClassified } from "@/types/tailwind";
import { TWindowTabs } from "@/types/editor";
import { ToggleButtonGroup } from "../../components/ToggleButtonGroup";
import {
  ALargeSmall,
  Columns2,
  EyeOff,
  GalleryVertical,
  LayoutGrid,
  Square,
} from "lucide-react";

interface DisplayProps {
  currentTWClass?: ITailwindClassClassified;
  usedBy: TWindowTabs;
}

export function Display({ currentTWClass, usedBy }: DisplayProps) {
  return (
    <ToggleButtonGroup
      currentTWClass={currentTWClass}
      groupItems={[
        {
          icon: <Square />,
          value: "block",
          "aria-label": "Toggle display block",
        },
        {
          icon: <Columns2 />,
          value: "flex",
          "aria-label": "Toggle display flex",
        },
        {
          icon: <LayoutGrid />,
          value: "grid",
          "aria-label": "Toggle display grid",
        },
        {
          icon: <ALargeSmall />,
          value: "inline",
          "aria-label": "Toggle display inline",
        },
        {
          icon: <GalleryVertical />,
          value: "inline-block",
          "aria-label": "Toggle display inline-block",
        },
        {
          icon: <EyeOff />,
          value: "hidden",
          "aria-label": "Toggle display hidden",
        },
      ]}
      usedBy={usedBy}
    />
  );
}
