import { ITailwindClassClassified } from "@/types/tailwind";
import { TWindowTabs } from "@/types/editor";
import { ToggleButtonGroup } from "../../components/ToggleButtonGroup";
import { Eye, EyeOff, Mouse, RefreshCw } from "lucide-react";

interface OverflowProps {
  currentTWClass?: ITailwindClassClassified;
  type: "all" | "x" | "y";
  usedBy: TWindowTabs;
}

export function Overflow({ currentTWClass, usedBy, type }: OverflowProps) {
  const overflowString = type === "all" ? "overflow" : `overflow-${type}`;
  return (
    <ToggleButtonGroup
      currentTWClass={currentTWClass}
      groupItems={[
        {
          icon: <Eye />,
          value: overflowString + "-visible",
          "aria-label": "Toggle overflow visible",
        },
        {
          icon: <EyeOff />,
          value: overflowString + "-hidden",
          "aria-label": "Toggle overflow hidden",
        },
        {
          icon: <Mouse />,
          value: overflowString + "-scroll",
          "aria-label": "Toggle overflow scroll",
        },
        {
          icon: <RefreshCw />,
          value: overflowString + "-auto",
          "aria-label": "Toggle overflow auto",
        },
      ]}
      usedBy={usedBy}
    />
  );
}
