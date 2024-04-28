import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex h-full w-full justify-start space-x-1 rounded-none px-2 py-1 text-sm font-normal text-white hover:text-white",
          )}
        >
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-light">{title}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col space-y-2 p-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
