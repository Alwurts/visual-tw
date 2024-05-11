import { Commit, db } from "@/lib/db/indexdb";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import Section from "./ui/section";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useEditorManager } from "@/hooks/useEditorManager";

export default function VersionControlPanel() {
  const saveNewVersion = useEditorManager((state) => state.saveNewVersion);

  const [commits, setCommits] = useState<Commit[]>([]);

  // Fetch commits from IndexedDB on mount
  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const loadedCommits = await db.commits.toArray();
        setCommits(loadedCommits);
      } catch (error) {
        console.error("Failed to fetch commits:", error);
      }
    };

    fetchCommits();
  }, []);

  return (
    <div className="flex max-h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center justify-between px-5">
        <h3 className="text-xs uppercase text-white">Versions</h3>
      </div>
      <Separator className="dark:bg-editor-gray-light" />
      <div className="flex flex-grow flex-col overflow-y-auto scrollbar scrollbar-thumb-neutral-700">
        <Section title="New Version">
          <form
            className="space-y-2 px-4 py-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const commitMessage = e.currentTarget.commitMessage.value;

              const newCommits = await saveNewVersion(commitMessage);

              if (!newCommits) return;
              // Update the state with the new commit
              setCommits(newCommits);

              // Reset the input value
              e.currentTarget.commitMessage.value = "";
            }}
          >
            <Label htmlFor="commitMessage">Commit message</Label>

            <Textarea
              id="commitMessage"
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
                    <Label className="text-base">{commit.id}</Label>
                    <p className="text-xs text-white">
                      {new Date(commit.timestamp).toLocaleString()}
                    </p>
                    <p className="break-words text-sm text-white">
                      {commit.commitMessage}
                    </p>
                    <div className="mt-2 rounded-md bg-editor-gray-light">
                      <img
                        src={commit.screenshot}
                        alt="Screenshot at commit"
                        className="h-32 w-full object-scale-down"
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
