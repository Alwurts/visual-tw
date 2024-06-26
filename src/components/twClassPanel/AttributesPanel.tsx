import { useMemo } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { debounce } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import Section from "@/components/ui/section";
import General from "@/components/twClassPanel/tools/General";
import { Alignment } from "@/components/twClassPanel/tools/typography/Alignment";
import InsertTWClassButton from "../buttons/InsertTWClassButton";
import { Display } from "./tools/layout/Display";
import { Overflow } from "./tools/size/Overflow";
import BackgroundColor from "./tools/background/BackgroundColor";
import TextColor from "./tools/typography/TextColor";
import FontSize from "./tools/typography/FontSize";
import FontWeight from "./tools/typography/FontWeight";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  sourceCodeLocationToIRange,
  trimValueAndUpdateLocation,
} from "@/lib/dom";
import { cn } from "@/lib/utils";

export default function AttributesPanel({ className }: { className?: string }) {
  const selected = useEditorManager((state) => state.selected);
  const insertCode = useEditorManager((state) => state.insertCode);
  const selectedElement = selected?.element;
  const twClassesCategorized = useEditorManager(
    (state) => state.selected?.class?.classes,
  );

  const twClassesCategorizedArray = useMemo(() => {
    if (!twClassesCategorized) return [];
    return Object.values(twClassesCategorized).flat();
  }, [twClassesCategorized]);

  return (
    <div
      key={selected?.twId}
      className={cn("flex max-h-full flex-col", className)}
    >
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-5">
        <h3 className="text-xs uppercase text-white">Attributes</h3>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div className="flex flex-grow flex-col overflow-y-auto scrollbar scrollbar-thumb-neutral-700">
        {selectedElement && "attrs" in selectedElement ? (
          <>
            <Section title="Details" className="space-y-2 px-4 py-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Tag:</Label>
                  <span className="text-sm text-white">
                    {selectedElement.nodeName}
                  </span>
                </div>
                <div className="flex flex-col items-start space-y-1">
                  <Label>Attributes</Label>
                  <div className="pl-2">
                    {selectedElement.attrs.map((attr, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 overflow-x-hidden"
                      >
                        <Label>{attr.name}:</Label>
                        <p className="whitespace-nowrap text-sm text-white">
                          {attr.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
            {selectedElement.childNodes.length === 1 &&
              "value" in selectedElement.childNodes[0] &&
              (() => {
                const textContent = trimValueAndUpdateLocation(
                  selectedElement.childNodes[0],
                );
                return (
                  <Section title="Text" className="space-y-2 px-4 py-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="textContent">Text content</Label>
                      <Textarea
                        defaultValue={textContent.value}
                        rows={5}
                        id="textContent"
                        onChange={(e) => {
                          debounce(
                            () => {
                              const newValue = e.target.value;
                              if (textContent.sourceCodeLocation) {
                                insertCode(
                                  newValue,
                                  sourceCodeLocationToIRange(
                                    textContent.sourceCodeLocation,
                                  ),
                                  {
                                    type: "CHANGE_NODE_TEXT",
                                    by: "attributes",
                                  },
                                );
                              }
                            },
                            700,
                            "UPDATE_NODE_TEXT",
                          )();
                        }}
                      />
                    </div>
                  </Section>
                );
              })()}
            <Section
              title="All classes"
              className="space-y-2 px-3 py-4"
              actions={<InsertTWClassButton usedBy="attributes" />}
              defaultOpen={false}
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
                <Label>Display</Label>
                <Display
                  currentTWClass={twClassesCategorized?.Display?.[0]}
                  usedBy="attributes"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Overflow</Label>
                <Overflow
                  type="all"
                  currentTWClass={twClassesCategorized?.Overflow?.[0]}
                  usedBy="attributes"
                />
              </div>
            </Section>
            <Section title="Typography" className="space-y-2 px-4 py-4">
              <div className="flex flex-col space-y-2">
                <Label>Alignment</Label>
                <Alignment
                  currentTWClass={twClassesCategorized?.Text_Align?.[0]}
                  usedBy="attributes"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Text Color</Label>
                <TextColor
                  currentTWClass={twClassesCategorized?.Text_Color?.[0]}
                  usedBy="attributes"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Font Size</Label>
                <FontSize
                  currentTWClass={twClassesCategorized?.Font_Size?.[0]}
                  usedBy="attributes"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Font Weight</Label>
                <FontWeight
                  currentTWClass={twClassesCategorized?.Font_Weight?.[0]}
                  usedBy="attributes"
                />
              </div>
            </Section>
            <Section title="Background" className="space-y-2 px-4 py-4">
              <div className="flex flex-col space-y-2">
                <Label>Background Color</Label>
                <BackgroundColor
                  currentTWClass={twClassesCategorized?.BackgroundColor?.[0]}
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
