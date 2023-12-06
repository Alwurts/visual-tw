import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";

function App() {
  const [code, setCode] = useState("");

  return (
    <div className="bg-gray-800 h-screen p-1 space-x-1 w-screen flex flex-row items-stretch">
      <CodeEditor code={code} setCode={setCode} />
      <CodeViewer html={code} />
    </div>
  );
}

export default App;
