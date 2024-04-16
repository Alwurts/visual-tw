import { Editor } from "@monaco-editor/react";
import type { editor as monacoEditor, IRange } from "monaco-editor";
import { useEffect, useRef } from "react";
import { editorManager } from "../lib/editor/EditorManager";
import { Separator } from "./ui/separator";
import type { EditorNotification } from "@/types/EditorManager";

const CodeEditor = () => {
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

  useEffect(() => {
    const subscribe = (notification: EditorNotification): void => {
      if (notification.type === "element-selected") {
        const domNodeCodeLocation = editorManager.getElementSourceCodeLocation(
          notification.data.uuid,
        );
        if (domNodeCodeLocation) {
          selectCode(domNodeCodeLocation);
        }
      }
    };

    editorManager.subscribe(subscribe);
    return () => {
      editorManager.unsubscribe(subscribe);
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
