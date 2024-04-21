import { Separator } from "./ui/separator";
import { useMemo, useRef } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CircleArrowDown } from "lucide-react";
import type { editor as monacoEditor } from "monaco-editor";
import { insertCode } from "@/lib/editor";
import {
  classAttributeToTwClasses,
  sourceCodeLocationToIRange,
} from "@/lib/dom";
import { TtailwindClass, categorizeClasses } from "@/lib/tailwind_classes";

interface AttributesPanelProps {
  editorRef: React.MutableRefObject<
    monacoEditor.IStandaloneCodeEditor | undefined
  >;
}

export default function AttributesPanel({ editorRef }: AttributesPanelProps) {
  const selectedElement = useEditorManager((state) => state.selectedElement);

  const twClassesCategorized = useMemo(() => {
    if (selectedElement && "attrs" in selectedElement) {
      const classAttribute = selectedElement.attrs.find(
        (attr) => attr.name === "class",
      )?.value;
      const classSourceCodeLocation =
        selectedElement.sourceCodeLocation?.attrs?.class;
      if (classAttribute && classSourceCodeLocation) {
        return categorizeClasses(
          classAttributeToTwClasses({
            value: classAttribute,
            sourceCodeLocation: classSourceCodeLocation,
          }),
        );
      }
    }
    return null;
  }, [selectedElement]);

  return (
    <div className="flex max-h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Node detail</h2>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div className="px-3 py-1">
        <h3 className="text-xs font-semibold uppercase text-white">
          Attributes
        </h3>
      </div>
      {selectedElement && "attrs" in selectedElement ? (
        <div className="flex flex-grow flex-col space-y-2 overflow-y-auto p-2 scrollbar scrollbar-thumb-neutral-700">
          {twClassesCategorized &&
            Object.entries(twClassesCategorized).map(
              ([categoryName, tailwindClasses], index) => {
                if (tailwindClasses.length === 0) return null;
                return (
                  <div key={index} className="space-y-2">
                    <h4 className="text-xs font-semibold text-white">
                      {categoryName === "Uncategorized"
                        ? "Other classes"
                        : categoryName}
                    </h4>
                    <div className="flex flex-col space-y-2">
                      {tailwindClasses.length ? (
                        tailwindClasses.map((twClass, index) => (
                          <AttributeInput
                            key={index + twClass.value}
                            twClass={twClass}
                            editorRef={editorRef}
                          />
                        ))
                      ) : (
                        <span className="ml-1 text-sm font-light text-white">
                          No classes found
                        </span>
                      )}
                    </div>
                  </div>
                );
              },
            )}
        </div>
      ) : (
        <div className="flex h-full flex-grow items-center justify-center text-sm text-white">
          <span>No element selected</span>
        </div>
      )}
    </div>
  );
}

interface AttributeInputProps {
  editorRef: React.MutableRefObject<
    monacoEditor.IStandaloneCodeEditor | undefined
  >;
  twClass: TtailwindClass;
}

function AttributeInput({
  editorRef,
  twClass: { value, sourceCodeLocation },
}: AttributeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex space-x-2">
      <Input
        ref={inputRef}
        className="h-auto px-3 py-0"
        type="text"
        defaultValue={value}
      />
      <Button
        variant="secondary"
        size="icon"
        onClick={() => {
          if (inputRef.current) {
            const inputValue = inputRef.current.value;
            if (editorRef.current) {
              insertCode(
                editorRef.current,
                sourceCodeLocationToIRange(sourceCodeLocation),
                inputValue,
              );
            }
          }
        }}
      >
        <CircleArrowDown className="h-4 w-4" />
        <span className="sr-only">{value}</span>
      </Button>
    </div>
  );
}
