import { useEffect, useState } from "react";
import * as dbTools from "@/lib/db/proxy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Project } from "@/lib/db/indexdb";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";

export default function ProjectsDropdown({ project }: { project: Project }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<"initial" | "rename">("initial");
  const [projects, setProjects] = useState<Project[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await dbTools.getProjects();
      setProjects(projects);
    };

    fetchProjects();
  }, []);

  const renameProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Rename new project");

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    console.log("Rename project", project.id, name);

    await dbTools.renameProject(project.id, name);
    navigate(0);
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setScreen("initial");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="tool" className="dark:text-white">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        /* onFocusOutside={() => {
          console.log("blur", screen);
        }} */
        align="center"
        className="mt-1 w-[400px] py-2"
      >
        {screen === "initial" ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Current project</DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-editor-gray-extra-light mx-1" />

              <div className="flex px-2">
                <h3 className="text-sm text-white">
                  <b className="font-semibold">Name: </b>
                  {project.name}
                </h3>
              </div>
              <div className="flex px-2">
                <p className="text-sm text-white">
                  <b className="font-semibold">Description: </b>
                  {project.description?.length
                    ? project.description
                    : "No description"}
                </p>
              </div>
              <div className="flex px-2">
                <p className="text-sm text-white">
                  <b className="font-semibold">Created at: </b>
                  {new Date(project.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex px-2">
                <p className="text-sm text-white">
                  <b className="font-semibold">Last updated at: </b>
                  {new Date(project.updatedAt).toLocaleString()}
                </p>
              </div>
              <DropdownMenuSeparator className="dark:bg-editor-gray-extra-light mx-1" />
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setScreen("rename");
                }}
                className="space-x-1 px-1"
              >
                <ChevronRight className="h-5 w-5 text-editor-accent" />
                <span className="font-semibold">Rename project</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Switch projects</DropdownMenuLabel>
              {projects.map((project) => {
                return (
                  <DropdownMenuItem
                    key={project.id}
                    onSelect={() => {
                      navigate(`/${project.id}`, { replace: true });
                      navigate(0);
                    }}
                    className="space-x-1 px-1"
                  >
                    <ChevronRight className="h-5 w-5 text-editor-accent" />
                    <div>
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <p className="text-xs text-white">
                        <b>Created at: </b>
                        {new Date(project.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-white">
                        <b>Last updated at: </b>
                        {new Date(project.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Rename project</DropdownMenuLabel>
            <form onSubmit={renameProject}>
              <div className="flex px-2">
                <Input
                  type="text"
                  id="name"
                  required
                  className="dark:bg-editor-gray-dark"
                  placeholder="New project name"
                />
              </div>
              <div className="flex px-2">
                <Button
                  variant="tool"
                  size="tool"
                  className="mt-2 h-7 px-2 dark:bg-editor-accent"
                >
                  Rename
                </Button>
              </div>
            </form>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
