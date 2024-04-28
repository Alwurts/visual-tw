import { Separator } from "./ui/separator";
import { useMemo } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { getElementByUUID } from "@/lib/dom";
import { splitClassAttributeIntoClasses } from "@/lib/tailwind";

import Section from "./ui/section";
import General from "./twClassPanel/inputs/General";

export default function AttributesPanel() {
  const selectedElement = useEditorManager(({ dom, selectedElementTWId }) => {
    if (!selectedElementTWId) return null;

    const selectedElement = getElementByUUID(dom, selectedElementTWId);
    return selectedElement;
  });

  const twClassesCategorized = useMemo(() => {
    if (selectedElement && "attrs" in selectedElement) {
      const classAttribute = selectedElement.attrs.find(
        (attr) => attr.name === "class",
      )?.value;

      const classAttributeSourceCodeLocation =
        selectedElement.sourceCodeLocation?.attrs?.class;

      if (classAttribute && classAttributeSourceCodeLocation) {
        const twClasses = splitClassAttributeIntoClasses({
          value: classAttribute,
          sourceCodeLocation: classAttributeSourceCodeLocation,
        });

        return twClasses;
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
      <div className="flex flex-grow flex-col overflow-y-auto scrollbar scrollbar-thumb-neutral-700">
        {selectedElement ? (
          twClassesCategorized?.length ? (
            <Section title="All classes">
              {twClassesCategorized.map((twClass, index) => (
                <General key={twClass.value + index} twClass={twClass} />
              ))}
            </Section>
          ) : (
            <div className="mx-auto my-20 text-white">No classes</div>
          )
        ) : (
          <div className="mx-auto my-20 text-white">No element selected</div>
        )}
      </div>
    </div>
  );
}
