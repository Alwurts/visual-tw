import { create } from "zustand";

import * as domTools from "../lib/dom";

import DEFAULT_EDITOR_CODE from "../lib/editor/defaultEditorCode.html?raw";

import type { Node } from "node_modules/parse5/dist/tree-adapters/default";
import { createRef } from "react";
import type { IRange, editor as monacoEditor } from "monaco-editor";
import { insertElements } from "@/lib/editor";
import { elementSourceCodeLocationToIRange } from "../lib/dom";

interface EditorManagerState {
  editorRef: React.MutableRefObject<monacoEditor.IStandaloneCodeEditor | null>;
  dom: Node;
  serializedDom: string;
  code: string;
  selectedElement: Node | null;
  updateCode: (newCode: string) => void;
  selectElement: (uuid: string) => void;
  highlightCode: (range: IRange) => void;
  insertHtmlElement: (
    type: "h1" | "h2" | "h3" | "div" | "span" | "p",
    range: IRange,
  ) => void;
}

const initialParsedCode = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);

export const useEditorManager = create<EditorManagerState>((set) => {
  const createEditorManager: EditorManagerState = {
    editorRef: createRef(),
    dom: initialParsedCode.dom,
    serializedDom: initialParsedCode.serializedDom,
    code: initialParsedCode.code,
    selectedElement: null,
    updateCode: (newCode) => {
      const { code, dom, serializedDom } = domTools.parseHTMLString(newCode);
      set({ code, dom, serializedDom, selectedElement: null });
    },
    selectElement: (uuid) => {
      set(({ dom }) => {
        const selectedElement = domTools.getElementByUUID(dom, uuid);
        if (selectedElement) {
          const domNodeCodeLocation =
            elementSourceCodeLocationToIRange(selectedElement);
          createEditorManager.highlightCode(domNodeCodeLocation);
        }
        return { selectedElement };
      });
    },
    highlightCode: (range) => {
      if (!createEditorManager.editorRef.current) return;
      const editor = createEditorManager.editorRef.current;
      editor.setSelection(range);
      editor.revealPositionInCenter({
        lineNumber: range.startLineNumber,
        column: range.endColumn,
      });
    },
    insertHtmlElement: (type, range) => {
      if (!createEditorManager.editorRef.current) return;
      const editor = createEditorManager.editorRef.current;
      insertElements(editor, type, range);
    },
  };
  return createEditorManager;
});
