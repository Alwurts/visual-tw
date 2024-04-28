import { Separator } from "./ui/separator";
import { useMemo } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { getElementByUUID } from "@/lib/dom";
import { classAttributeToTwClasses } from "@/lib/tailwind";

import Section from "./ui/section";
import InputClassifier from "./twClassPanel/InputClassifier";

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
        const twClasses = classAttributeToTwClasses({
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
        <Section title="All classes">
          {twClassesCategorized &&
            twClassesCategorized.map((twClass) => (
              <InputClassifier key={twClass.value} twClass={twClass} />
            ))}
        </Section>
      </div>
    </div>
  );
}
