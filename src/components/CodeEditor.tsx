import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  code?: string;
  setCode: (code: string) => void;
}

const CodeEditor = ({ setCode }: CodeEditorProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorChange = (value: any, event: any) => {
    console.log("here is the current model value:", value);
    console.log("here is the current model event:", event);
    if (value) setCode(value);
  };
  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="html"
      onChange={handleEditorChange}
      defaultValue="// some comment"
      theme="vs-dark"
      options={{ fontSize: 14 }} // Change the font size here
    />
  );
};

export default CodeEditor;
