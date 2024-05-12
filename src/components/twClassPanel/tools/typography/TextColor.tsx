import { ITailwindClassClassified } from "@/types/tailwind";
import textColorNames from "@/lib/tailwindNames/textColor";
import { TWindowTabs } from "@/types/editor";
import SelectOption from "../../components/SelectOption";
import { cn } from "@/lib/utils";

interface TextColorProps {
  currentTWClass?: ITailwindClassClassified;
  usedBy: TWindowTabs;
}

export default function TextColor({ currentTWClass, usedBy }: TextColorProps) {
  return (
    <SelectOption
      currentTWClass={currentTWClass}
      selectItems={textColorNames}
      selectPlaceholder="Select Text Color"
      selectItemDisplay={(value) => (
        <div className="flex items-center">
          <div
            className={cn(
              "mr-2 h-4 w-4 rounded",
              value.replace("text-", "bg-"),
            )}
          />
          {value}
        </div>
      )}
      usedBy={usedBy}
    />
  );
}
