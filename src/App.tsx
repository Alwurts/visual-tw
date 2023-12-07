import { useEffect, useState } from "react";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import { CodeBlock } from "./types/Code";
import * as parse5 from "parse5";
import { traverseParse5Document } from "./utils/html";

const codeBlockTracker: {
  [key: string]: CodeBlock;
} = {};

function App() {
  const [code, setCode] = useState(`<!DOCTYPE html>
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

</html>`);

  /* const [code, setCode] = useState(
    `<h2 class="text-3xl font-bold mb-3 text-center">Get Started</h2>`
  ); */

  const [parsedCode, setParsedCode] = useState<string>("");

  useEffect(() => {
    const document = parse5.parse(code, { sourceCodeLocationInfo: true });

    traverseParse5Document(document, (node) => {
      if (node.tagName && node.sourceCodeLocation) {
        const { tagName } = node;
        const { startLine, startCol, endLine, endCol } =
          node.sourceCodeLocation;

        const codeBlockIdentifier = `${startLine}-${startCol}-${endLine}-${endCol}`;

        codeBlockTracker[codeBlockIdentifier] = {
          startLine,
          startCol,
          endLine,
          endCol,
          tagName,
        };

        node.attrs.push({
          name: "re-id",
          value: codeBlockIdentifier,
        });
      }
    });

    const updatedHtml = parse5.serialize(document);

    setParsedCode(updatedHtml);
  }, [code]);

  return (
    <div className="bg-gray-800 h-screen p-1 space-x-1 w-screen flex flex-row items-stretch">
      <CodeEditor
        code={code}
        setCode={setCode}
        codeBlockTracker={codeBlockTracker}
      />
      <CodeViewer code={parsedCode} codeBlockTracker={codeBlockTracker} />
    </div>
  );
}

export default App;
