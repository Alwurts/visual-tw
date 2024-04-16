import "./App.css";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import NodeExplorer from "./components/NodeExplorer";
import SideNavigation from "./components/SideNavigation";

function App() {
  return (
    <main className="bg-editor-black">
      <nav className="h-[32px] bg-editor-gray-medium px-3 py-1">
        <h1 className="font-bold text-white">
          Visual<span className="text-editor-accent">TW</span>
        </h1>
      </nav>
      <div className="flex h-[calc(100dvh-32px)]">
        <SideNavigation />
        <PanelGroup direction="horizontal" className="bg-editor-black">
          <Panel defaultSize={15} minSize={15} maxSize={20}>
            <NodeExplorer />
          </Panel>
          <PanelResizeHandle className="ResizeHandle" />
          <Panel minSize={30}>
            <CodeEditor />
          </Panel>
          <PanelResizeHandle className="ResizeHandle" />
          <Panel minSize={30}>
            <CodeViewer />
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}

export default App;
