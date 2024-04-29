import { useMemo } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { getElementByUUID } from "@/lib/dom";
import { splitClassAttributeIntoClasses } from "@/lib/classAttribute";

import { Separator } from "@/components/ui/separator";
import Section from "@/components/ui/section";
import General from "@/components/twClassPanel/inputs/General";
import { Alignment } from "@/components/twClassPanel/inputs/typography/Alignment";
import InsertTWClassButton from "./buttons/InsertTWClassButton";

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

  const twClassesCategorizedArray = useMemo(() => {
    if (!twClassesCategorized) return [];
    return Object.values(twClassesCategorized).flat();
  }, [twClassesCategorized]);

  return (
    <div className="flex max-h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-5">
        <h3 className="text-xs uppercase text-white">Attributes</h3>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div className="flex flex-grow flex-col overflow-y-auto scrollbar scrollbar-thumb-neutral-700">
        {selectedElement ? (
          <>
            <Section title="Details" className="space-y-2 px-4 py-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">Tag:</span>
                  <span className="text-sm text-white">
                    {selectedElement.nodeName}
                  </span>
                </div>
              </div>
            </Section>
            <Section
              title="All classes"
              className="space-y-2 px-3 py-4"
              actions={<InsertTWClassButton />}
            >
              {twClassesCategorizedArray?.length ? (
                twClassesCategorizedArray.map((twClass, index) => (
                  <General key={twClass.value + index} twClass={twClass} />
                ))
              ) : (
                <p className="my-7 text-center text-white">No classes</p>
              )}
            </Section>
            <Section title="Typography" className="space-y-2 px-4 py-4">
              <div className="flex items-baseline justify-between space-x-2">
                <span className="text-sm font-semibold text-white">
                  Alignment
                </span>
                <Alignment
                  defaultClass={twClassesCategorized?.Text_Align?.[0]}
                />
              </div>
            </Section>
          </>
        ) : (
          <div className="mx-auto my-20 text-white">No element selected</div>
        )}
      </div>
    </div>
  );
}
