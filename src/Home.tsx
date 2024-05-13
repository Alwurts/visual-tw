import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./components/ui/button";
import * as dbTools from "@/lib/db/proxy";
import { Project } from "./lib/db/indexdb";
import { Separator } from "./components/ui/separator";
import BaseLayout from "./components/layout/Base";
import { NewProject } from "./components/NewProject";
import { EllipsisVertical, Github, Globe, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { cn } from "./lib/utils";
import XIcon from "./components/icons/XIcon";

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
    <BaseLayout projectName="No project selected" className="flex items-center">
      <div className="flex h-full w-full flex-col items-stretch space-y-20 overflow-y-auto px-20 py-24 scrollbar scrollbar-thumb-neutral-700">
        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-white">Create project</h2>
          <NewProject />
        </div>
        <Separator className="dark:bg-editor-gray-medium" />
        <div className="flex flex-col space-y-10 px-4">
          <p className="text-sm text-white">Or select an existing project</p>
          {projects.length > 0 ? (
            <ul className="space-y-6 ">
              {projects
                .sort((a, b) => {
                  return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                  );
                })
                .map((project) => (
                  <li
                    className="flex items-start justify-between"
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
                    <div className="w-40 ml-auto mr-10 rounded-md bg-editor-gray-light">
                      <img
                        src={project.screenshot}
                        alt="Screenshot at commit"
                        className="h-24 w-full object-contain"
                      />
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
      <Separator
        orientation="vertical"
        className="dark:bg-editor-gray-medium"
      />
      <div className="w-4/12 flex-initial px-16 text-white">
        <div>
          <h2 className="mb-5 text-xl font-bold text-white">
            Welcome to Visual-TW
          </h2>
          <p className="text-white">
            Visual-TW is a visual editor for HTML and Tailwind CSS. Create and
            edit projects visually or in code.
          </p>
          <p className="mt-2">
            The editor features run entirely in the browser making sure your
            projects are private and secure.
          </p>
          <p className="mt-2">
            This project is open-source and free to use. If you like it, please
            consider supporting the project by sharing it with your friends.
          </p>
          <a
            className={cn(
              buttonVariants({ variant: "link", size: "tool" }),
              "mt-5 text-base font-normal italic dark:hover:text-editor-accent",
            )}
            href="https://www.alwurts.com"
            target="_blank"
          >
            Alejandro Wurts
          </a>
        </div>
        <Separator className="my-4 dark:bg-editor-gray-medium" />
        <div className="space-y-2">
          <p className="">Follow the project progress on:</p>
          <div className="flex space-x-2">
            <a
              className={buttonVariants({ variant: "tool", size: "icon" })}
              href="https://github.com/Alwurts/visual-tw"
              target="_blank"
              title="View on Github"
            >
              <Github className="h-6 w-6 dark:text-white" />
            </a>
            <a
              className={buttonVariants({ variant: "tool", size: "icon" })}
              href="https://twitter.com/Alwurts"
              target="_blank"
              title="Follow on X"
            >
              <XIcon className="h-6 w-6 dark:text-white" />
            </a>
            <a
              className={buttonVariants({ variant: "tool", size: "icon" })}
              href="https://www.alwurts.com"
              target="_blank"
              title="View on alwurts.com"
            >
              <Globe className="h-6 w-6 dark:text-white" />
            </a>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Home;
