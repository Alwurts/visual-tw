import { Editor } from "@monaco-editor/react";
import type { editor as monacoEditor } from "monaco-editor";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { CopyIcon, Paintbrush } from "lucide-react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const CodeEditor = () => {
  const editorRef = useEditorManager((state) => state.editorRef);
  //const initialCode = useEditorManager((state) => state.code);

  const updateCode = useEditorManager((state) => state.updateCode);
  const formatEditorCode = useEditorManager((state) => state.formatEditorCode);

  const [position, setPosition] = useState({ lineNumber: 1, column: 1 });

  function copyEditorCode() {
    const editorCode = editorRef.current?.getValue();
    if (editorCode) {
      navigator.clipboard.writeText(editorCode);
    }
  }

  const handleEditorChange = (code: string | undefined) => {
    if (code) {
      updateCode(code);
    }
  };
  const initiateProject = useEditorManager((state) => state.initiateProject);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const initializeEditor = (editor: monacoEditor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      setPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });

    const initiate = async () => {
      if (id) {
        const loadedProject = await initiateProject(id);
        if (loadedProject) {
          editor.setValue(loadedProject.code);
        } else {
          navigate("/");
        }
      }
    };
    initiate();
  };

  return (
    <div className="h-full">
      <div className="flex h-10 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Code</h2>
        <div className="text-xs text-white">
          Line: {position.lineNumber}, Col: {position.column}
        </div>
        <div className="flex space-x-1">
          <Button size="tool" variant="tool" onClick={copyEditorCode}>
            <CopyIcon className="h-4 w-4 flex-shrink-0" />
          </Button>
          <Button
            size="tool"
            variant="tool"
            onClick={() => formatEditorCode("monacoEditor")}
          >
            <Paintbrush className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>
      </div>
      <Separator className="bg-editor-gray-light" />
      <Editor
        theme="vs-dark"
        defaultLanguage="html"
        //defaultValue={initialCode}
        onMount={initializeEditor}
        onChange={handleEditorChange}
        options={{ fontSize: 14 }}
      />
    </div>
  );
};

export default CodeEditor;
