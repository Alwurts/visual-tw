import { Editor } from "@monaco-editor/react";
/* import { CodeBlock } from "../types/Code"; */

interface CodeEditorProps {
  code?: string;
  setCode: (code: string) => void;
  /* codeBlockTracker: {
    [key: string]: CodeBlock;
  }; */
}

const CodeEditor = ({ setCode, code }: CodeEditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  return (
    <Editor
      //height="100%"
      //width="100%"
      defaultLanguage="html"
      onChange={handleEditorChange}
      defaultValue={code}
      theme="vs-dark"
      options={{ fontSize: 14, glyphMargin: true }}
    />
  );
};

export default CodeEditor;
