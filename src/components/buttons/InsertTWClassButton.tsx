import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";

export default function InsertTWClassButton() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="tool" size="tool">
          <PlusIcon className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex w-[240px] items-end space-x-1 pt-2"
      >
        <div className="space-y-1">
          <Label className="ml-1">New class</Label>
          <Input type="text" className="h-7 dark:bg-editor-gray-medium" />
        </div>
        <Button variant="tool" size="tool" className="px-2">
          Insert
        </Button>
      </PopoverContent>
    </Popover>
  );
}
