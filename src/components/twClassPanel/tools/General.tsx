import { ITailwindClass } from "@/types/tailwind";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Search, TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEditorManager } from "@/hooks/useEditorManager";
import { sourceCodeLocationToIRange } from "@/lib/dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TWindowTabs } from "@/types/editor";

interface GeneralProps {
  twClass: ITailwindClass;
  usedBy: TWindowTabs;
}

export default function General({ twClass, usedBy }: GeneralProps) {
  const [isInputFocused, setInputFocused] = useState(false);

  const highlightCode = useEditorManager((state) => state.highlightCode);
  const changeTwClass = useEditorManager((state) => state.changeTwClass);
  const deleteCode = useEditorManager((state) => state.deleteCode);

  return (
    <div className="flex items-center justify-stretch">
      <Input
        type="text"
        onFocus={() => setInputFocused(true)}
        onBlur={(e) => {
          const inputValue = e.target.value;
          if (inputValue !== twClass.value) {
            changeTwClass(twClass, inputValue, usedBy);
          }
          setInputFocused(false);
        }}
        defaultValue={twClass.value}
        className={cn("h-7 text-center dark:bg-editor-gray-medium", {
          "rounded-r-none": !isInputFocused,
        })}
      />
      <Separator orientation="vertical" className="flex-shrink-0" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="tool"
            className={cn("h-7 rounded-l-none border-l-0 px-1", {
              hidden: isInputFocused,
            })}
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          {twClass.sourceCodeLocation && (
            <DropdownMenuItem
              onSelect={() => {
                if (twClass.sourceCodeLocation) {
                  highlightCode(
                    sourceCodeLocationToIRange(twClass.sourceCodeLocation),
                  );
                }
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Locate code
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600 dark:focus:bg-red-800"
            onSelect={() => {
              if (twClass.sourceCodeLocation) {
                deleteCode(
                  sourceCodeLocationToIRange(twClass.sourceCodeLocation),
                  usedBy,
                );
              }
            }}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
