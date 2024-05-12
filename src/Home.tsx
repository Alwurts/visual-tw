import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import * as dbTools from "@/lib/db/proxy";
import { Project } from "./lib/db/indexdb";
import { Separator } from "./components/ui/separator";
import BaseLayout from "./components/layout/Base";

function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  const createNewProject = async () => {
    const newProjectId = await dbTools.createNewProject("New Project");
    navigate(`/${newProjectId}`);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await dbTools.getProjects();
      setProjects(projects);
    };

    fetchProjects();
  }, []);

  return (
    <BaseLayout>
      <div className="mt-20 flex h-3/5 w-full items-start justify-center space-x-4">
        <div className="flex flex-col space-y-2 py-2">
          <h2 className="text-white">Create project</h2>
          <Button
            variant="tool"
            className="dark:bg-editor-accent"
            onClick={createNewProject}
          >
            Create new project
          </Button>
        </div>
        <Separator
          orientation="vertical"
          className="dark:bg-editor-gray-medium"
        />
        <div className="flex h-full flex-col py-2 ">
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
                    <Button
                      variant="tool"
                      size="tool"
                      className="dark:bg-editor-accent"
                      onClick={() => navigate(`/${project.id}`)}
                    >
                      Open
                    </Button>
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
    </BaseLayout>
  );
}

export default Home;
