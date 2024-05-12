import "./App.css";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import SideNavigation from "./components/SideNavigation";
import { useEffect, useState } from "react";
import { TWindowTabs } from "@/types/editor";
import { cn } from "./lib/utils";
//import NodeExplorer from "./components/NodeExplorer";
import AttributesPanel from "./components/twClassPanel/AttributesPanel";
import VersionControlPanel from "./components/VersionControlPanel";
import { useParams } from "react-router-dom";
import { useEditorManager } from "./hooks/useEditorManager";

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

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      setProjectId(id);
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
        {id && (
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
        )}
      </div>
    </main>
  );
}

export default App;
