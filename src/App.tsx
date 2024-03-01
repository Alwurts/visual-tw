import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import useCodeManager from "./hooks/useCodeManager";

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
    <div className="bg-gray-800 p-1 space-x-1 flex flex-row items-stretch">
      <CodeEditor code={code} setCode={setCode} />
      <CodeViewer code={parsedCode} />
    </div>
  );
}

export default App;
