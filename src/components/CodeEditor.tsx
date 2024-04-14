/* eslint-disable @typescript-eslint/no-unused-vars */
import { Editor } from "@monaco-editor/react";
import { useRef } from "react";
/* import { CodeBlock } from "../types/Code"; */

interface CodeEditorProps {
  code?: string;
  setCode: (code: string) => void;
  /* codeBlockTracker: {
    [key: string]: CodeBlock;
  }; */
}

const CodeEditor = ({ setCode, code }: CodeEditorProps) => {
  const editorRef = useRef(null);

  // @ts-expect-error sdds
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function formatCode() {
    if (editorRef.current) {
      // @ts-expect-error dsds
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  return (
    <div className="h-full">
      <div>
        <button onClick={formatCode}>Format Code</button>
      </div>
      <Editor
        //height="100%"
        //width="100%"
        //className="h-full"
        /* wrapperProps={{
          style: {
            flexGrow: 1,
          },
        }} */
        theme="vs-dark"
        defaultLanguage="html"
        defaultValue={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{ fontSize: 14, glyphMargin: true }}
      />
    </div>
  );
};

export default CodeEditor;
