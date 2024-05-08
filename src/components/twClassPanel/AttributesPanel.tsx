import { useMemo } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";

import { Separator } from "@/components/ui/separator";
import Section from "@/components/ui/section";
import General from "@/components/twClassPanel/tools/General";
import { Alignment } from "@/components/twClassPanel/tools/typography/Alignment";
import InsertTWClassButton from "../buttons/InsertTWClassButton";
import { Display } from "./tools/layout/Display";
import { Overflow } from "./tools/size/Overflow";

export default function AttributesPanel() {
  const selectedElement = useEditorManager((state) => state.selected?.element);
  const twClassesCategorized = useEditorManager(
    (state) => state.selected?.class?.classes,
  );

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
              actions={<InsertTWClassButton usedBy="attributes" />}
            >
              {twClassesCategorizedArray?.length ? (
                twClassesCategorizedArray.map((twClass, index) => (
                  <General
                    key={twClass.value + index}
                    twClass={twClass}
                    usedBy="attributes"
                  />
                ))
              ) : (
                <p className="my-7 text-center text-white">No classes</p>
              )}
            </Section>
            <Section title="Layout" className="space-y-2 px-4 py-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold text-white">
                  Display
                </span>
                <Display
                  currentTWClass={twClassesCategorized?.Display?.[0]}
                  usedBy="attributes"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold text-white">
                  Overflow
                </span>
                <Overflow
                  type="all"
                  currentTWClass={twClassesCategorized?.Overflow?.[0]}
                  usedBy="attributes"
                />
              </div>
            </Section>
            <Section title="Typography" className="space-y-2 px-4 py-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold text-white">
                  Alignment
                </span>
                <Alignment
                  currentTWClass={twClassesCategorized?.Text_Align?.[0]}
                  usedBy="attributes"
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
