import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import StructureIcon from "./components/icons/StructureIcon";
import CodeIcon from "./components/icons/CodeIcon";
import "./App.css";

function App() {
  return (
    <main className="bg-editor-black">
      <nav className="h-[32px] bg-editor-gray-medium px-3 py-1">
        <h1 className="font-bold text-white">
          Visual<span className="text-editor-accent">TW</span>
        </h1>
      </nav>
      <div className="flex h-[calc(100dvh-32px)]">
        <div className="flex w-12 flex-col items-stretch bg-editor-gray-light">
          <button className="border-l-2 border-l-white py-2 text-white hover:text-white">
            <StructureIcon className="inline-flex h-6 w-6" />
          </button>
          <button className="py-2 text-neutral-600 hover:text-white">
            <CodeIcon className="inline-flex h-7 w-7" />
          </button>
        </div>
        <PanelGroup direction="horizontal" className="bg-editor-black">
          {/* <Panel minSize={30}>
            <div>
              <h2 className="text-white uppercase">Node Explorer</h2>
              
            </div>
          </Panel> */}
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
