import { Editor } from "@monaco-editor/react";
import type { editor as monacoEditor } from "monaco-editor";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { CopyIcon, Paintbrush } from "lucide-react";
import { useEditorManager } from "@/hooks/useEditorManager";
import * as editorTools from "@/lib/editor";

const CodeEditor = () => {
  const editorRef = useEditorManager((state) => state.editorRef);
  const initialCode = useEditorManager((state) => state.code);

  const updateCode = useEditorManager((state) => state.updateCode);

  function formatEditorCode() {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
    if (editorRef.current) {
      editorTools.formatEditorCode(editorRef.current);
    }
  }

  function copyEditorCode() {
    const editorCode = editorRef.current?.getValue();
    if (editorCode) {
      navigator.clipboard.writeText(editorCode);
    }
  }

  //const debouncedUpdateCode = debounce(updateCode, 200);

  const handleEditorChange = (code: string | undefined) => {
    if (code) {
      /* switch (codeUpdatedBy) {
        case "attributes":
        case "explorer":
        case "viewer":
          console.log("Without debounce");
          updateCode(code);
          break;
        default:
          console.log("With debounce");
          debouncedUpdateCode(code);
      } */
      updateCode(code);
    }
  };

  const initializeEditor = (editor: monacoEditor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full">
      <div className="flex h-10 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Code</h2>
        <div className="flex space-x-1">
          <Button size="tool" variant="tool" onClick={copyEditorCode}>
            <CopyIcon className="h-4 w-4 flex-shrink-0" />
          </Button>
          <Button size="tool" variant="tool" onClick={formatEditorCode}>
            <Paintbrush className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>
      </div>
      <Separator className="bg-editor-gray-light" />
      <Editor
        theme="vs-dark"
        defaultLanguage="html"
        defaultValue={initialCode}
        onMount={initializeEditor}
        onChange={handleEditorChange}
        options={{ fontSize: 14 }}
      />
    </div>
  );
};

export default CodeEditor;
