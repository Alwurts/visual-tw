import { ITailwindClassClassified } from "@/types/tailwind";
import bgNames from "@/lib/tailwindNames/backgroundColor";
import { TWindowTabs } from "@/types/editor";
import SelectOption from "../../components/SelectOption";
import { cn } from "@/lib/utils";

interface BackgroundColorProps {
  currentTWClass?: ITailwindClassClassified;
  usedBy: TWindowTabs;
}

export default function BackgroundColor({
  currentTWClass,
  usedBy,
}: BackgroundColorProps) {
  return (
    <SelectOption
      currentTWClass={currentTWClass}
      selectItems={bgNames}
      selectPlaceholder="Select Background Color"
      selectItemDisplay={(value) => (
        <div className="flex items-center">
          <div className={cn("mr-2 h-4 w-4 rounded", value)} />
          {value}
        </div>
      )}
      usedBy={usedBy}
    />
  );
}
