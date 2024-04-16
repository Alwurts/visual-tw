import { Editor } from "@monaco-editor/react";
import type { editor as monacoEditor, IRange } from "monaco-editor";
import { useEffect, useRef } from "react";
import { editorManager } from "../lib/editor/EditorManager";
import { ViewerMessage } from "@/types/Viewer";
import { Separator } from "./ui/separator";

const CodeEditor = () => {
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

  useEffect(() => {
    const handleViewerMessage = ({
      data: { type, data },
    }: MessageEvent<ViewerMessage>) => {
      if (type === "elementhovered") {
        const domNodeCodeLocation = editorManager.getElementSourceCodeLocation(
          data.id,
        );
        if (domNodeCodeLocation) {
          selectCode(domNodeCodeLocation);
        }
      }
    };

    window.addEventListener("message", handleViewerMessage);
    return () => {
      window.removeEventListener("message", handleViewerMessage);
    };
  }, []);

  function selectCode(range: IRange) {
    editorRef.current?.setSelection(range);
  }

  /* function formatEditorCode() {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  } */

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      editorManager.updateCode(value);
    }
  };

  const initializeEditor = (editor: monacoEditor.IStandaloneCodeEditor) => {
    const editorInitialCode = editorManager.getCode();
    editor.setValue(editorInitialCode);
    editorManager.updateCode();
    editorRef.current = editor;
  };

  return (
    <div className="h-full">
      <div className="p-3">
        <h2 className="text-xs uppercase text-white">Code</h2>
      </div>
      <Separator className="bg-editor-gray-light" />
      <Editor
        theme="vs-dark"
        defaultLanguage="html"
        onChange={handleEditorChange}
        onMount={initializeEditor}
        options={{ fontSize: 14, glyphMargin: true }}
      />
    </div>
  );
};

export default CodeEditor;
