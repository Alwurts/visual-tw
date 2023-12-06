import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";

function App() {
  const [code, setCode] = useState("");

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  return (
    <div className="bg-green-800 h-screen p-2 space-x-3 w-screen flex flex-row items-stretch">
      <CodeEditor code={code} onChange={handleCodeChange} />
      <CodeViewer html={code} />
    </div>
  );
}

export default App;
