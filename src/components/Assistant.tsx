import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Paperclip, CornerDownLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

import { useState } from "react";
import { sendMessage } from "@/lib/assistant";
import { useEditorManager } from "@/hooks/useEditorManager";

export default function Assistant({ className }: { className?: string }) {
  const updateCodeByAssistant = useEditorManager((state) => state.updateCodeByAssistant);
  const saveNewVersion = useEditorManager((state) => state.saveNewVersion);

  const [messages, setMessages] = useState<
    {
      name: string;
      content: string;
    }[]
  >([
    {
      name: "assistant",
      content: "What would you like to create?",
    },
  ]);

  const [incomingMessage, setIncomingMessage] = useState<string | null>(null);

  const [input, setInput] = useState("");

  const onSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { name: "user", content: newMessage }]);

    const uiExpertResponse = await sendMessage(
      newMessage,
      "google",
      (chunk) => {
        setIncomingMessage((prev) => {
          const prevIncoming = prev ? prev.concat(chunk) : chunk;
          updateCodeByAssistant(prevIncoming);
          return prevIncoming;
        });
      },
    );

    if (!uiExpertResponse) {
      return;
    }

    setIncomingMessage(null);
    updateCodeByAssistant(uiExpertResponse);
    saveNewVersion("Assistant created UI");
    setMessages((prev) => [
      ...prev,
      {
        name: "assistant",
        content: "Done! Let me know if you need anything else.",
      },
    ]);
  };
  return (
    <div className={cn("flex h-full flex-col bg-editor-gray-dark", className)}>
      <div className="flex h-10 flex-shrink-0 items-center px-6">
        <h2 className="text-xs uppercase text-white">Assistant</h2>
      </div>
      <Separator className="dark:bg-editor-gray-medium" />
      <div className="relative m-4 flex flex-grow flex-col space-y-4 overflow-y-auto rounded-lg p-4 dark:bg-editor-gray-light">
        <div className="flex-grow space-y-3 overflow-y-auto text-white scrollbar scrollbar-thumb-neutral-700">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "my-2 flex rounded-lg p-2",
                message.name === "user"
                  ? "ml-10 self-end bg-editor-accent"
                  : "mr-10 bg-editor-gray-light dark:bg-editor-gray-extra-light",
              )}
            >
              <p>{message.content.toString()}</p>
            </div>
          ))}
          {incomingMessage && (
            <div className="my-2 mr-10 flex animate-pulse rounded-lg bg-editor-gray-light p-2 dark:bg-editor-gray-extra-light">
              <p>...Loading</p>
            </div>
          )}
        </div>
        <form
          onSubmit={onSendMessage}
          className="bg-background focus-within:ring-ring relative flex-shrink-0 rounded-lg border focus-within:border-white/60 focus-within:ring-1 focus-within:ring-white/60 dark:bg-editor-gray-medium"
        >
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <Textarea
            id="message"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Type your message here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none scrollbar-thumb-neutral-600 focus-visible:ring-0 dark:bg-transparent dark:ring-offset-0"
          />
          <div className="flex items-center p-3 pt-0 ">
            <Button
              type="button"
              variant="tool"
              size="icon"
              title="Attach file"
            >
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button
              type="submit"
              size="sm"
              className="ml-auto gap-1.5 dark:hover:bg-editor-accent dark:hover:text-white"
              title="Send Message"
            >
              Create UI
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
