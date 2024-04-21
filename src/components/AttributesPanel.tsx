import { Separator } from "./ui/separator";
import { useMemo } from "react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CircleArrowDown } from "lucide-react";

export default function AttributesPanel() {
  const selectedElement = useEditorManager((state) => state.selectedElement);

  const nodeClassAttribute = useMemo(() => {
    if (selectedElement && "attrs" in selectedElement) {
      const classAttribute = selectedElement.attrs.find(
        (attr) => attr.name === "class",
      )?.value;
      return classAttribute?.split(" ");
    }
    return null;
  }, [selectedElement]);

  return (
    <div className="h-full">
      <div className="flex h-10 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Node detail</h2>
      </div>
      <Separator className="bg-editor-gray-light" />
      <div className="px-3 py-1">
        <h3 className="text-xs font-semibold uppercase text-white">
          Attributes
        </h3>
      </div>
      {selectedElement && "attrs" in selectedElement ? (
        <div className="flex h-full flex-col space-y-2 overflow-y-auto p-2 scrollbar scrollbar-thumb-neutral-700">
          {nodeClassAttribute?.map((className, index) => (
            <AttributeInput key={index} value={className} />
          ))}
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
  value: string;
}

function AttributeInput({ value }: AttributeInputProps) {
  return (
    <div className="flex space-x-2">
      <Input
        className="h-auto px-3 py-0"
        type="text"
        value={value}
        onChange={() => {
          //console.log(e.target.value);
        }}
      />
      <Button variant="secondary" size="icon">
        <CircleArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
