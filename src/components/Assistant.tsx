import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Paperclip, CornerDownLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { useState } from "react";
import { UI_TAILWIND_EXPERT_PROMPT } from "@/lib/assistant";
import { useEditorManager } from "@/hooks/useEditorManager";

export default function Assistant({ className }: { className?: string }) {
  const updateCode = useEditorManager((state) => state.updateCodeByAssistant);

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

    setMessages((prev) => [...prev, { name: "user", content: input }]);

    const chatModel = new ChatOpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: "gpt-4o",
    });

    const outputParser = new StringOutputParser();

    const chain = UI_TAILWIND_EXPERT_PROMPT.pipe(chatModel).pipe(outputParser);

    const uiExpertStream = await chain.stream({
      input,
    });

    const streamChunks = [];
    for await (const streamChunk of uiExpertStream) {
      //console.log(`${streamChunk}|`);
      streamChunks.push(streamChunk);
      setIncomingMessage((prev) =>
        prev ? prev.concat(streamChunk) : streamChunk,
      );
      //updateCode(streamChunk);
    }

    let uiExpertResponse = streamChunks[0];

    for (const chunk of streamChunks) {
      uiExpertResponse = uiExpertResponse.concat(chunk);
    }

    setIncomingMessage(null);
    updateCode(uiExpertResponse);
    setMessages((prev) => [
      ...prev,
      {
        name: "assistant",
        content: uiExpertResponse,
      },
    ]);

    setInput("");
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
            <div className="my-2 mr-10 flex rounded-lg bg-editor-gray-light p-2 dark:bg-editor-gray-extra-light">
              <p>{incomingMessage}</p>
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
