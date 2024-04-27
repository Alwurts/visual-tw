import {
  Heading1,
  Heading2,
  Layers,
  PlusIcon,
  SquareDashedBottom,
  Text,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEditorManager } from "@/hooks/useEditorManager";
import { getElementByUUID, getElementsByTagName } from "@/lib/dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { useState } from "react";

export default function InsertButton() {
  const selectedElement = useEditorManager(({ dom, selectedElementTWId }) => {
    if (!selectedElementTWId) return null;

    const selectedElement = getElementByUUID(dom, selectedElementTWId);
    return selectedElement;
  });
  const insertHtmlElement = useEditorManager(
    (state) => state.insertHtmlElementCode,
  );

  const [open, setOpen] = useState(false);

  const domExplorer = useEditorManager(({ dom }) => {
    const bodyNode = getElementsByTagName(dom, "body")[0];
    if ("childNodes" in bodyNode === true) {
      const bodyChilds = bodyNode.childNodes;
      return bodyChilds;
    }
  });

  function handleInsertClick(type: "h1" | "h2" | "h3" | "div" | "span" | "p") {
    const createInsertParams = (line: number, col: number) => ({
      startLineNumber: line,
      startColumn: col,
      endLineNumber: line,
      endColumn: col,
    });

    if (
      selectedElement?.sourceCodeLocation &&
      "startTag" in selectedElement.sourceCodeLocation
    ) {
      const selectedLocation = selectedElement?.sourceCodeLocation?.startTag;
      if (selectedLocation?.endLine && selectedLocation?.endCol) {
        insertHtmlElement(
          type,
          createInsertParams(selectedLocation.endLine, selectedLocation.endCol),
        );
      }
    } else {
      const { endLine, endCol } =
        domExplorer?.[domExplorer.length - 1]?.sourceCodeLocation ?? {};
      if (endLine && endCol) {
        insertHtmlElement(type, createInsertParams(endLine, endCol));
      }
    }

    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="tool" variant="tool">
          <PlusIcon className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command className="rounded-lg border-red-600 shadow-md">
          {/* <CommandInput placeholder="Search" />
          <CommandEmpty>No results found.</CommandEmpty> */}
          <CommandList>
            <CommandGroup heading="Elements">
              <CommandItem
                onSelect={() => {
                  handleInsertClick("div");
                }}
              >
                <Layers className="mr-2 h-4 w-4" />
                <span>Div</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  handleInsertClick("span");
                }}
              >
                <SquareDashedBottom className="mr-2 h-4 w-4" />
                <span>Span</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  handleInsertClick("h1");
                }}
              >
                <Heading1 className="mr-2 h-4 w-4" />
                <span>H1</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  handleInsertClick("h2");
                }}
              >
                <Heading2 className="mr-2 h-4 w-4" />
                <span>H2</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  handleInsertClick("h3");
                }}
              >
                <Heading2 className="mr-2 h-4 w-4" />
                <span>H3</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  handleInsertClick("p");
                }}
              >
                <Text className="mr-2 h-4 w-4" />
                <span>P</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
