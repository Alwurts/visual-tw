import { Separator } from "./ui/separator";
import { useMemo, useRef } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CircleArrowDown, ScanSearch } from "lucide-react";
import { sourceCodeLocationToIRange } from "@/lib/dom";
import {
  categorizeTailwindClasses,
  classAttributeToTwClasses,
} from "@/lib/tailwind";
import { ITailwindClass } from "@/types/Tailwind";

export default function AttributesPanel() {
  const selectedElement = useEditorManager((state) => state.selectedElement);

  const twClassesCategorized = useMemo(() => {
    if (selectedElement && "attrs" in selectedElement) {
      const classAttribute = selectedElement.attrs.find(
        (attr) => attr.name === "class",
      )?.value;

      const classAttributeSourceCodeLocation =
        selectedElement.sourceCodeLocation?.attrs?.class;

      if (classAttribute && classAttributeSourceCodeLocation) {
        const twClasses = classAttributeToTwClasses({
          value: classAttribute,
          sourceCodeLocation: classAttributeSourceCodeLocation,
        });

        const categorizedClasses = categorizeTailwindClasses(twClasses);

        return categorizedClasses;
      }
    }
    return null;
  }, [selectedElement]);

  return (
    <div className="flex max-h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-5">
        <h3 className="text-xs uppercase text-white">Attributes</h3>
      </div>
      <Separator className="bg-editor-gray-light" />
      {selectedElement && "attrs" in selectedElement ? (
        <div className="flex flex-grow flex-col space-y-2 overflow-y-auto p-2 scrollbar scrollbar-thumb-neutral-700">
          {twClassesCategorized &&
            Object.entries(twClassesCategorized).map(
              ([categoryName, tailwindClasses], index) => {
                if (Object.keys(tailwindClasses).length === 0) return null;
                return (
                  <div key={index + categoryName} className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-white">
                      {categoryName === "Other"
                        ? "Other classes"
                        : categoryName.split("_").join(" ")}
                    </h4>
                    <div className="mx-1 flex flex-col space-y-2">
                      {Object.entries(tailwindClasses).map(
                        ([subcategory, twClasses], index) => (
                          <div key={index + subcategory} className="space-y-1">
                            <h5 className="text-xs font-normal text-white">
                              {subcategory.split("_").join(" ")}
                            </h5>
                            <div className="flex flex-col space-y-2">
                              {twClasses.map((twClass, index) => (
                                <AttributeInput
                                  key={index + twClass.value}
                                  twClass={twClass}
                                />
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                    <Separator />
                  </div>
                );
              },
            )}
        </div>
      ) : (
        <div className="flex flex-grow items-center justify-center text-sm text-white">
          <span>No element selected</span>
        </div>
      )}
    </div>
  );
}

interface AttributeInputProps {
  twClass: ITailwindClass;
}

function AttributeInput({ twClass }: AttributeInputProps) {
  const editorRef = useEditorManager((state) => state.editorRef);
  const highlightCode = useEditorManager((state) => state.highlightCode);
  const changeTwClass = useEditorManager((state) => state.changeTwClass);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedElement = useEditorManager((state) => state.selectedElement);

  return (
    <div className="flex space-x-2">
      <Input
        ref={inputRef}
        className="h-auto px-3 py-0"
        type="text"
        defaultValue={twClass.value}
      />
      <Button
        variant="secondary"
        size="icon"
        onClick={() => {
          if (inputRef.current && selectedElement) {
            const inputValue = inputRef.current.value;
            changeTwClass(selectedElement, twClass, inputValue);
          }
        }}
      >
        <CircleArrowDown className="h-4 w-4" />
        <span className="sr-only">{twClass.value}</span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        aria-label="Highlight atribute in code"
        onClick={() => {
          if (editorRef.current) {
            highlightCode(
              sourceCodeLocationToIRange(twClass.sourceCodeLocation),
            );
          }
        }}
      >
        <ScanSearch className="h-4 w-4" />
      </Button>
    </div>
  );
}
