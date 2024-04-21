import {
  Heading1,
  Heading2,
  Layers,
  PlusIcon,
  SquareDashedBottom,
  Text,
} from "lucide-react";
import { Button } from "./ui/button";
import type { editor as monacoEditor } from "monaco-editor";
import { insertElements } from "@/lib/editor";
import { useEditorManager } from "@/hooks/useEditorManager";
import { getElementsByTagName } from "@/lib/dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { useState } from "react";

interface InsertButtonProps {
  editorRef: React.MutableRefObject<
    monacoEditor.IStandaloneCodeEditor | undefined
  >;
}

export default function InsertButton({ editorRef }: InsertButtonProps) {
  const selectedElement = useEditorManager((state) => state.selectedElement);

  const [open, setOpen] = useState(false);

  const domExplorer = useEditorManager(({ dom }) => {
    const bodyNode = getElementsByTagName(dom, "body")[0];
    if ("childNodes" in bodyNode === true) {
      const bodyChilds = bodyNode.childNodes;
      return bodyChilds;
    }
  });

  function handleInsertClick(type: "h1" | "h2" | "h3" | "div" | "span" | "p") {
    if (editorRef.current) {
      if (
        selectedElement &&
        selectedElement.sourceCodeLocation &&
        "startTag" in selectedElement.sourceCodeLocation &&
        selectedElement.sourceCodeLocation.startTag?.endLine &&
        selectedElement.sourceCodeLocation.startTag?.endCol
      ) {
        insertElements(
          editorRef.current,
          {
            startLineNumber:
              selectedElement.sourceCodeLocation.startTag.endLine,
            startColumn: selectedElement.sourceCodeLocation.startTag.endCol,
            endLineNumber: selectedElement.sourceCodeLocation.startTag.endLine,
            endColumn: selectedElement.sourceCodeLocation.startTag.endCol,
          },
          type,
        );
      }
      if (!selectedElement) {
        const endLine =
          domExplorer?.[domExplorer.length - 1]?.sourceCodeLocation?.endLine;
        const endCol =
          domExplorer?.[domExplorer.length - 1]?.sourceCodeLocation?.endCol;
        if (endLine && endCol) {
          insertElements(
            editorRef.current,
            {
              startLineNumber: endLine,
              startColumn: endCol,
              endLineNumber: endLine,
              endColumn: endCol,
            },
            type,
          );
        }
      }
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="tool" variant="tool">
          <PlusIcon className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="dark w-48 p-0">
        <Command className="rounded-lg border-red-600 shadow-md">
          {/* <CommandInput placeholder="Search" />
          <CommandEmpty>No results found.</CommandEmpty> */}
          <CommandList>
            <CommandGroup heading="Elements">
              <CommandItem
                onSelect={() => {
                  console.log("click");
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
