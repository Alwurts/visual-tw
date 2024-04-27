import { Separator } from "./ui/separator";
import { useMemo } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { getElementByUUID } from "@/lib/dom";
import {
  categorizeTailwindClasses,
  classAttributeToTwClasses,
} from "@/lib/tailwind";
import Classifier from "./tw/Classifier";

export default function AttributesPanel() {
  const selectedElementParsed = useEditorManager(
    ({ dom, selectedElementTWId }) => {
      if (!selectedElementTWId) return null;

      const selectedElement = getElementByUUID(dom, selectedElementTWId);
      return { selectedElement, selectedElementTWId };
    },
  );

  const selectedElement = selectedElementParsed?.selectedElement;
  const selectedElementTWId = selectedElementParsed?.selectedElementTWId;

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
              ([categoryName, tailwindClassesSubCategories]) => {
                if (Object.keys(tailwindClassesSubCategories).length === 0) {
                  return null;
                }
                return (
                  <div
                    key={`${selectedElementTWId}-${categoryName}`}
                    className="space-y-2"
                  >
                    <h4 className="text-xs font-semibold uppercase text-white">
                      {categoryName === "Other"
                        ? "Other classes"
                        : categoryName.split("_").join(" ")}
                    </h4>
                    <div className="mx-1 flex flex-col space-y-2">
                      {Object.entries(tailwindClassesSubCategories).map(
                        ([subcategory, twClasses]) => (
                          <div
                            key={`${selectedElementTWId}-${subcategory}`}
                            className="space-y-1"
                          >
                            <h5 className="text-xs font-normal text-white">
                              {subcategory.split("_").join(" ")}
                            </h5>
                            <div className="flex flex-col space-y-2">
                              {twClasses.map((twClass) => (
                                <Classifier
                                  key={`${selectedElementTWId}-${twClass.value}`}
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
