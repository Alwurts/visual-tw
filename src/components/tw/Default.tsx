import { ITailwindClass } from "@/types/tailwind/base";
import { sourceCodeLocationToIRange } from "@/lib/dom";
import HighlightCodeButton from "../buttons/HighlightCodeButton";

export default function Default({ twClass }: { twClass: ITailwindClass }) {
  return (
    <div className="flex items-stretch space-x-2">
      <span className="flex flex-grow items-center justify-start self-stretch rounded-md bg-editor-gray-medium px-3 text-sm text-white">
        {twClass.value}
      </span>
      <HighlightCodeButton
        range={sourceCodeLocationToIRange(twClass.sourceCodeLocation)}
      />
    </div>
  );
}
