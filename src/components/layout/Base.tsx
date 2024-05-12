import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useEditorManager } from "@/hooks/useEditorManager";
import ProjectsDropdown from "../ProjectsDropdown";

export default function BaseLayout({
  children,
  toolbar,
  className,
}: {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  projectName?: string;
  className?: string;
}) {
  const project = useEditorManager((state) => state.project);

  return (
    <main className="bg-editor-black">
      <nav className="flex h-[32px] items-center justify-between bg-editor-gray-medium px-4 py-1">
        <span className="flex items-center space-x-2">
          <h1 className="font-bold text-white">
            Visual-
            <span className="text-editor-accent">TW</span>
          </h1>
          <Badge variant="secondary">beta</Badge>
        </span>
        <div className="flex items-center space-x-1">
          <h1 className="text-sm text-white">
            <b>Project: </b>
            {project?.name || "-"}
          </h1>
          {project && <ProjectsDropdown project={project} />}
        </div>
        <div>{toolbar}</div>
      </nav>
      <div className={cn("h-[calc(100dvh-32px)]", className)}>{children}</div>
    </main>
  );
}
