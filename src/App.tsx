import "./App.css";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import SideNavigation from "./components/SideNavigation";
import { useEffect, useState } from "react";
import { TWindowTabs } from "./types/editorManager";
import { cn } from "./lib/utils";
//import NodeExplorer from "./components/NodeExplorer";
import AttributesPanel from "./components/twClassPanel/AttributesPanel";
import VersionControlPanel from "./components/VersionControlPanel";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./components/ui/button";
import * as dbTools from "@/lib/db/proxy";
import { useEditorManager } from "./hooks/useEditorManager";
import { Project } from "./lib/db/indexdb";
import { Separator } from "./components/ui/separator";

function App() {
  const setProjectId = useEditorManager((state) => state.setProjectId);

  const [openTabs, setOpenTabs] = useState<{
    [K in TWindowTabs]: boolean;
  }>({
    explorer: true,
    monacoEditor: true,
    viewer: true,
    attributes: true,
  });
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

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
    if (id) {
      setProjectId(id);
    } else {
      fetchProjects();
    }
  }, [id, setProjectId]);

  return (
    <main className="bg-editor-black ">
      <nav className="h-[32px] bg-editor-gray-medium px-3 py-1">
        <h1 className="font-bold text-white">
          Visual
          <span className="text-editor-accent">TW</span>
        </h1>
      </nav>
      <div className="flex h-[calc(100dvh-32px)]">
        {id ? (
          <>
            <SideNavigation openTabs={openTabs} setOpenTabs={setOpenTabs} />
            <PanelGroup direction="horizontal" className="bg-editor-black">
              <Panel
                className={cn({
                  hidden: !openTabs.explorer,
                })}
                defaultSize={15}
                minSize={10}
                maxSize={15}
              >
                {/* <NodeExplorer /> */}
                <VersionControlPanel />
              </Panel>
              <PanelResizeHandle
                className={cn("ResizeHandle", {
                  hidden: !openTabs.explorer,
                })}
              />

              <Panel
                minSize={30}
                className={cn({
                  hidden: !openTabs.monacoEditor,
                })}
              >
                <CodeEditor />
              </Panel>
              <PanelResizeHandle
                className={cn("ResizeHandle", {
                  hidden: !openTabs.monacoEditor,
                })}
              />

              <Panel minSize={30}>
                <CodeViewer />
              </Panel>

              <PanelResizeHandle
                className={cn("ResizeHandle", {
                  hidden: !openTabs.attributes,
                })}
              />
              <Panel
                defaultSize={16}
                minSize={16}
                maxSize={20}
                className={cn("bg-editor-gray-dark", {
                  hidden: !openTabs.attributes,
                })}
              >
                <AttributesPanel />
              </Panel>
            </PanelGroup>
          </>
        ) : (
          <div className="my-auto flex h-3/5 w-full items-start justify-center space-x-4">
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
              <p className="text-sm text-white">
                Or select an existing project
              </p>
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
                          <h3 className="text-white font-bold">{project.name}</h3>
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
                <p className="text-sm my-auto px-5 text-white">No projects available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
