import HighlightCodeButton from "@/components/buttons/HighlightCodeButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditorManager } from "@/hooks/useEditorManager";
import { sourceCodeLocationToIRange } from "@/lib/dom";
import { cn } from "@/lib/utils";
import { ITailwindClass } from "@/types/tailwind/base";
import bgNames from "@/types/tailwind/backgroundColor";

interface BackgroundColorProps {
  twClass: ITailwindClass;
}

export default function BackgroundColor({ twClass }: BackgroundColorProps) {
  const changeTwClass = useEditorManager((state) => state.changeTwClass);
  return (
    <div className="flex space-x-1">
      <Select
        defaultValue={twClass.value}
        onValueChange={(newValue) => {
          changeTwClass(twClass, newValue);
        }}
      >
        <SelectTrigger className="bg-editor-gray-dark text-white">
          <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent>
          {bgNames.map((name) => (
            <SelectItem key={name} value={name}>
              <div className="flex items-center">
                <div className={cn("mr-2 h-4 w-4 rounded", name)} />
                {name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {twClass.sourceCodeLocation && (
        <HighlightCodeButton
          range={sourceCodeLocationToIRange(twClass.sourceCodeLocation)}
        />
      )}
    </div>
  );
}
