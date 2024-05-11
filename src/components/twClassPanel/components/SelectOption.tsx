import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditorManager } from "@/hooks/useEditorManager";
import { ITailwindClassClassified } from "@/types/tailwind";
import { TWindowTabs } from "@/types/editorManager";

interface SelectOptionProps {
  currentTWClass?: ITailwindClassClassified;
  selectPlaceholder: string;
  selectItems: string[];
  selectItemDisplay?: (value: string) => JSX.Element;
  usedBy: TWindowTabs;
}

export default function SelectOption({
  currentTWClass,
  selectItems,
  selectPlaceholder,
  selectItemDisplay,
  usedBy,
}: SelectOptionProps) {
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
    <Select value={currentTWClass?.value} onValueChange={handleToolChange}>
      <SelectTrigger className="h-fit px-3 py-[6px] text-white ">
        <SelectValue placeholder={selectPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {selectItems.map((value, index) => (
          <SelectItem key={index + value} value={value} aria-label={value}>
            {selectItemDisplay ? selectItemDisplay(value) : value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
