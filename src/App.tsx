import "./App.css";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import SideNavigation from "./components/SideNavigation";
import { useState } from "react";
import { TWindowTabs } from "./types/EditorManager";
import { cn } from "./lib/utils";
import NodeExplorer from "./components/NodeExplorer";
import AttributesPanel from "./components/AttributesPanel";

function App() {
  const [openTabs, setOpenTabs] = useState<{
    [K in TWindowTabs]: boolean;
  }>({
    explorer: true,
    monacoEditor: true,
    viewer: true,
    attributes: true,
  });

  return (
    <main className="bg-editor-black">
      <nav className="h-[32px] bg-editor-gray-medium px-3 py-1">
        <h1 className="font-bold text-white">
          Visual<span className="text-editor-accent">TW</span>
        </h1>
      </nav>
      <div className="flex h-[calc(100dvh-32px)]">
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
            <NodeExplorer />
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
            defaultSize={15}
            minSize={10}
            maxSize={20}
            className={cn({
              hidden: !openTabs.attributes,
            })}
          >
            <AttributesPanel />
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}

export default App;
