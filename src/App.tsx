import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import useCodeManager from "./hooks/useCodeManager";
import StructureIcon from "./components/icons/StructureIcon";
import CodeIcon from "./components/icons/CodeIcon";
import "./App.css";

function App() {
  const initialCode = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>
    <div class="bg-white text-blue-800 w-screen h-screen">
        <div class="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold mb-3 text-center">Get Started</h2>
        </div>
    </div>
</body>

</html>`;

  const { code, setCode, parsedCode } = useCodeManager(initialCode);

  return (
    <main className="bg-editor-black bg-yellow-300">
      <nav className="h-[32px] bg-editor-gray-medium px-3 py-1">
        <h1 className="font-bold text-white">
          Visual<span className="text-editor-accent">TW</span>
        </h1>
      </nav>
      <div className="flex h-[calc(100dvh-32px)] bg-green-300">
        <div className="flex w-12 flex-col items-stretch bg-editor-gray-light">
          <button className="border-l-2 border-l-white py-2 text-white hover:text-white">
            <StructureIcon className="inline-flex h-7 w-7" />
          </button>
          <button className="py-2 text-neutral-600 hover:text-white">
            <CodeIcon className="inline-flex h-7 w-7" />
          </button>
        </div>
        <PanelGroup direction="horizontal" className="bg-editor-black">
          <Panel collapsible={true} minSize={30}>
            <CodeEditor code={code} setCode={setCode} />
          </Panel>
          <PanelResizeHandle className="ResizeHandle" />
          <Panel>
            {/* <div className="overflow-auto h-full w-full">
              <div className="bg-green-300 m-auto w-[375px] h-[667px] border-2 border-black rounded-xl">
                sds
              </div>
            </div> */}
            <CodeViewer code={parsedCode} />
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}

export default App;
