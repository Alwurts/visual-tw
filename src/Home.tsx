import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import * as dbTools from "@/lib/db/proxy";
import { Project } from "./lib/db/indexdb";
import { Separator } from "./components/ui/separator";
import BaseLayout from "./components/layout/Base";
import { NewProject } from "./components/NewProject";
import { EllipsisVertical, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await dbTools.getProjects();
      setProjects(projects);
    };

    fetchProjects();
  }, []);

  return (
    <BaseLayout className="flex flex-col items-center space-y-10 py-10">
      <div className="flex flex-grow w-full max-w-screen-md items-stretch space-x-4">
        <div className="flex flex-shrink-0 flex-col items-center space-y-2 px-8 py-20">
          <h2 className="text-white">Create project</h2>
          <NewProject />
        </div>
        <Separator
          orientation="vertical"
          className="dark:bg-editor-gray-medium"
        />
        <div className="flex h-full flex-grow flex-col px-6 py-2">
          <p className="text-sm text-white">Or select an existing project</p>
          {projects.length > 0 ? (
            <ul className="mt-4 space-y-2 overflow-y-auto pr-4 scrollbar scrollbar-thumb-neutral-700">
              {projects
                .sort((a, b) => {
                  return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                  );
                })
                .map((project) => (
                  <li
                    className="flex items-start justify-between space-x-5 "
                    key={project.id}
                  >
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
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="tool"
                        size="tool"
                        className="h-7 px-2 dark:bg-editor-accent"
                        onClick={() => navigate(`/${project.id}`)}
                      >
                        Open
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="tool" size="tool" className="h-7">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-fit">
                          <DropdownMenuItem
                            className="text-red-600 dark:focus:bg-red-800"
                            onSelect={async () => {
                              await dbTools.deleteProject(project.id);
                              setProjects((prev) =>
                                prev.filter((p) => p.id !== project.id),
                              );
                            }}
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="my-auto px-5 text-sm text-white">
              No projects available
            </p>
          )}
        </div>
      </div>
      <div className="w-full max-w-screen-md space-y-3">
        <Separator className="dark:bg-editor-gray-medium" />
        <h2 className="text-xl font-bold text-white">About</h2>
        <p className="text-white">
          Visual editor for HTML and Tailwind CSS. Create and edit projects
          visually or in code.
        </p>
        <p className="text-white">
          This project is a work in progress, if you would like to follow visit{" "}
          <a
            className="text-editor-accent underline"
            href="https://github.com/Alwurts/visual-tw"
            target="_blank"
          >
            Visual-TW github
          </a>
        </p>
        <h4 className="text-white">
          Made by:{" "}
          <a
            className="text-editor-accent underline"
            href="https://www.alwurts.com"
            target="_blank"
          >
            Alwurts
          </a>
        </h4>
      </div>
    </BaseLayout>
  );
}

export default Home;
