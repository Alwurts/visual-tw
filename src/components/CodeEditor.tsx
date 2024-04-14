/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Editor } from "@monaco-editor/react";
import { useRef } from "react";
import { editorManager } from "../utils/editorManager/EditorManager";
import DEFAULT_CODE from "../utils/editorManager/default.html?raw";
/* import { CodeBlock } from "../types/Code"; */

/* const defaultCode = `<!DOCTYPE html>
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
    
    </html>`; */

const CodeEditor = () => {
  const editorRef = useRef(null);

  // @ts-expect-error sdds
  function handleEditorDidMount(editor, monaco) {
    editor.value = editorManager.updateCode(DEFAULT_CODE);
    editorRef.current = editor;
  }

  /* function selectCode(range: any) {
    if (editorRef.current) {
      // @ts-expect-error dsds
      editorRef.current.setSelection(range);
    }
  } */

  /* function selectFirstTenChars() {
    selectCode({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 11,
    });
  }

  function formatCode() {
    if (editorRef.current) {
      // @ts-expect-error dsds
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  } */

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      editorManager.updateCode(value);
    }
  };

  return (
    <div className="h-full">
      {/* <div>
        <button onClick={undefined}>Format Code</button>
      </div> */}
      <Editor
        theme="vs-dark"
        defaultLanguage="html"
        defaultValue={DEFAULT_CODE}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{ fontSize: 14, glyphMargin: true }}
      />
    </div>
  );
};

export default CodeEditor;
