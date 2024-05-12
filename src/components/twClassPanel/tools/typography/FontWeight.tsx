import { ITailwindClassClassified } from "@/types/tailwind";
import fontWeightNames from "@/lib/tailwindNames/fontWeight";
import { TWindowTabs } from "@/types/editor";
import SelectOption from "../../components/SelectOption";

interface FontWeightProps {
  currentTWClass?: ITailwindClassClassified;
  usedBy: TWindowTabs;
}

export default function FontWeight({
  currentTWClass,
  usedBy,
}: FontWeightProps) {
  return (
    <SelectOption
      currentTWClass={currentTWClass}
      selectItems={fontWeightNames}
      selectPlaceholder="Select Font Weight"
      usedBy={usedBy}
    />
  );
}
