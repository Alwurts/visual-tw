import type { Commit } from "@/lib/db/indexdb";
import { FormEvent, useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import Section from "./ui/section";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useEditorManager } from "@/hooks/useEditorManager";
import * as dbTools from "@/lib/db/proxy";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function VersionControlPanel({
  className,
}: {
  className?: string;
}) {
  const saveNewVersion = useEditorManager((state) => state.saveNewVersion);

  const [commits, setCommits] = useState<Commit[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const onSubmitNewVersion = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.length <= 0) {
      setError("Commit message is required");
      return;
    }

    const newCommits = await saveNewVersion(inputValue);

    if (!newCommits) {
      setError("Failed to save version");
      return;
    }
    setInputValue("");
    setError("");
    setCommits(newCommits);
  };

  const { id } = useParams<{ id: string }>();

  // Fetch commits from IndexedDB on mount
  useEffect(() => {
    const fetchCommits = async () => {
      try {
        if (!id) return;
        const loadedCommits = await dbTools.getCommits(id);
        setCommits(loadedCommits);
      } catch (error) {
        console.error("Failed to fetch commits:", error);
      }
    };

    fetchCommits();
  }, [id]);

  return (
    <div className={cn("flex max-h-full flex-col", className)}>
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-5">
        <h3 className="text-xs uppercase text-white">Versions</h3>
      </div>
      <Separator className="dark:bg-editor-gray-light" />
      <div className="flex flex-grow flex-col overflow-y-auto scrollbar scrollbar-thumb-neutral-700">
        <Section title="New Version">
          <form className="space-y-2 px-4 py-4" onSubmit={onSubmitNewVersion}>
            <Label htmlFor="commitMessage">Commit message</Label>

            <Textarea
              id="commitMessage"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a commit message"
              className="h-7 dark:bg-editor-gray-medium"
            />
            <Button
              variant="tool"
              size="tool"
              className="w-full px-2 dark:bg-editor-accent"
              type="submit"
            >
              New version
            </Button>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </form>
        </Section>
        <Section title="History" className="space-y-2">
          {commits.length > 0 ? (
            commits
              .sort((a, b) => {
                return (
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
                );
              })
              .map((commit, index) => (
                <div key={index}>
                  <Separator className="dark:bg-editor-gray-medium" />
                  <div className="flex flex-col px-4 py-3">
                    <Label className="text-base">{commit.title}</Label>
                    <p className="text-xs text-white">
                      {new Date(commit.timestamp).toLocaleString()}
                    </p>
                    <p className="break-words text-sm text-white">
                      {commit.description}
                    </p>
                    <div className="mt-2 rounded-md bg-editor-gray-light">
                      <img
                        src={commit.screenshot}
                        alt="Screenshot at commit"
                        className="h-32 w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-sm text-gray-500">
              No commits available
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}
