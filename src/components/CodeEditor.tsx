import { Editor } from "@monaco-editor/react";
import type { editor as monacoEditor, IRange } from "monaco-editor";
import { useEffect, useRef } from "react";
import { editorManager } from "../lib/editor/EditorManager";
import { Separator } from "./ui/separator";
import {
  isNotificationElementSelected,
  type EditorNotification,
} from "@/types/EditorManager";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";

const CodeEditor = () => {
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

  useEffect(() => {
    const subscribe = (notification: EditorNotification): void => {
      if (isNotificationElementSelected(notification)) {
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

  function copyEditorCode() {
    const editorCode = editorRef.current?.getValue();
    if (editorCode) {
      navigator.clipboard.writeText(editorCode);
    }
  }

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
      <div className="flex h-10 items-center justify-between px-6">
        <h2 className="text-xs uppercase text-white">Code</h2>
        <div className="flex space-x-1">
          <Button
            size="icon"
            className="h-auto w-auto rounded-sm p-1 hover:bg-editor-accent"
            onClick={copyEditorCode}
          >
            <CopyIcon className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>
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
