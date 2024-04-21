import { Editor } from "@monaco-editor/react";
import type { IRange, editor as monacoEditor } from "monaco-editor";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { CopyIcon, Paintbrush } from "lucide-react";
import { useEditorManager } from "@/hooks/useEditorManager";
import { elementSourceCodeLocationToIRange } from "@/lib/dom";
import * as editorTools from "@/lib/editor";

interface CodeEditorProps {
  editorRef: React.MutableRefObject<
    monacoEditor.IStandaloneCodeEditor | undefined
  >;
}

const CodeEditor = ({ editorRef }: CodeEditorProps) => {
  //const editorRef = useRef<monacoEditor.IStandaloneCodeEditor>();

  const updateCode = useEditorManager((state) => state.updateCode);
  const initialCode = useEditorManager((state) => state.code);

  useEditorManager(({ selectedElement }) => {
    if (!selectedElement) return;

    const domNodeCodeLocation =
      elementSourceCodeLocationToIRange(selectedElement);
    selectCode(domNodeCodeLocation);
  });

  function selectCode(range: IRange) {
    editorRef.current?.setSelection(range);
    editorRef.current?.revealLineInCenter(range.startLineNumber);
  }

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

  const handleEditorChange = (code: string | undefined) => {
    if (code) {
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
        options={{ fontSize: 14, glyphMargin: true }}
      />
    </div>
  );
};

export default CodeEditor;
