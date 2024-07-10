import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { UI_REFERENCE_CODE_PROMPT, sendMessage } from "@/lib/assistant";
import { useEditorManager } from "@/hooks/useEditorManager";

interface AssistantPromptProps {
  code: string | null;
  setCode: (code: string | null) => void;
}

export function AssistantPrompt({ code, setCode }: AssistantPromptProps) {
  const updateCodeByAssistant = useEditorManager(
    (state) => state.updateCodeByAssistant,
  );

  const editorCode = useEditorManager((state) => state.code);

  const sendNewPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const prompt = (form.elements.namedItem("prompt") as HTMLInputElement)
      .value;

    const formattedPrompt = await UI_REFERENCE_CODE_PROMPT.format({
      codeToModify: code || "",
      referenceCode: editorCode || "",
      input: prompt,
    });

    console.log("formattedPrompt", formattedPrompt);

    setCode(null);
    const uiExpertResponse = await sendMessage(
      formattedPrompt,
      "openai",
      (chunk, prevChunks) => {
        console.log("chunk", chunk);
        updateCodeByAssistant(prevChunks + chunk);
      },
    );
    console.log("uiExpertResponse", uiExpertResponse);

    if (!uiExpertResponse) {
      return;
    }

    updateCodeByAssistant(uiExpertResponse);
  };

  return (
    <Dialog
      open={!!code}
      onOpenChange={(newValue) => {
        if (!newValue) {
          setCode(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          {/* <DialogDescription>{code}</DialogDescription> */}
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={sendNewPrompt}>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" placeholder="What to change" className="" />
          </div>
          <DialogFooter>
            <Button variant="tool" type="submit">
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
