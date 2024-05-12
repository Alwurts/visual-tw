import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { useEditorManager } from "@/hooks/useEditorManager";
import { ActionResponse, TWindowTabs } from "@/types/editor";

interface InsertTWClassButtonProps {
  usedBy: TWindowTabs;
}

export default function InsertTWClassButton(props: InsertTWClassButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<ActionResponse>();
  const inputRef = useRef<HTMLInputElement>(null);
  const insertTwClass = useEditorManager((state) => state.insertTwClass);

  return (
    <Popover
      open={open}
      onOpenChange={(openChange) => {
        if (!openChange) {
          setError();
        }
        setOpen(openChange);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="tool" size="tool">
          <PlusIcon className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[240px] pt-2">
        <div className="flex items-end space-x-1">
          <div className="space-y-1">
            <Label className="ml-1">New class</Label>
            <Input
              ref={inputRef}
              type="text"
              className="h-7 dark:bg-editor-gray-medium"
            />
          </div>
          <Button
            variant="tool"
            size="tool"
            className="px-2"
            onClick={() => {
              if (inputRef.current) {
                const newTwClass = inputRef.current.value;
                if (newTwClass && newTwClass.length > 0) {
                  const res = insertTwClass(newTwClass, props.usedBy);
                  if (res && res.isError) {
                    setError(res);
                    return;
                  }
                  setOpen(false);
                  return;
                }

                setError({
                  message: "Class cannot be empty",
                  isError: true,
                });
              }
            }}
          >
            Insert
          </Button>
        </div>
        {error?.isError && (
          <p className="ml-2 mt-1 text-sm text-red-500">{error.message}</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
