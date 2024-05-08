import { ITailwindClassClassified } from "@/types/tailwind";
import fontSizeNames from "@/lib/tailwindNames/fontSize";
import { TWindowTabs } from "@/types/EditorManager";
import SelectOption from "../../components/SelectOption";

interface FontSizeProps {
  currentTWClass?: ITailwindClassClassified;
  usedBy: TWindowTabs;
}

export default function FontSize({ currentTWClass, usedBy }: FontSizeProps) {
  return (
    <SelectOption
      currentTWClass={currentTWClass}
      selectItems={fontSizeNames}
      selectPlaceholder="Select Font Size"
      usedBy={usedBy}
    />
  );
}
