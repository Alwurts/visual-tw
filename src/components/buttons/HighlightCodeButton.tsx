import { IRange } from "monaco-editor";
import { Button } from "../ui/button";
import { useEditorManager } from "@/hooks/useEditorManager";
import { ScanSearch } from "lucide-react";

interface HighlightCodeButtonProps {
  range: IRange;
}

export default function HighlightCodeButton({
  range,
}: HighlightCodeButtonProps) {
  const highlightCode = useEditorManager((state) => state.highlightCode);

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Highlight atribute in code"
      onClick={() => {
        highlightCode(range);
      }}
      className="flex-shrink-0"
    >
      <ScanSearch className="h-4 w-4" />
    </Button>
  );
}
