import { create } from "zustand";

import * as domTools from "../lib/dom";
import * as editorTools from "@/lib/editor";

import DEFAULT_EDITOR_CODE from "../lib/editor/defaultEditorCode.html?raw";

import type { Document } from "node_modules/parse5/dist/tree-adapters/default";
import { createRef } from "react";
import type { IRange, editor as monacoEditor } from "monaco-editor";
import { elementSourceCodeLocationToIRange } from "../lib/dom";
import { TWindowTabs } from "@/types/EditorManager";
import { ITailwindClass } from "@/types/tailwind/base";
import { debounce } from "@/lib/utils";

interface EditorManagerState {
  editorRef: React.MutableRefObject<monacoEditor.IStandaloneCodeEditor | null>;
  dom: Document;
  serializedDom: string;
  code: string;
  selectedElementTWId: string | null;
  codeUpdatedBy: TWindowTabs | null;
  updateCode: (newCode: string) => void;
  selectElement: (uuid: string) => void;
  highlightCode: (range: IRange) => void;
  insertCode: (code: string, range: IRange, insertedBy: TWindowTabs) => void;
  insertHtmlElementCode: (
    type: "h1" | "h2" | "h3" | "div" | "span" | "p",
    range: IRange,
    insertedBy: TWindowTabs,
  ) => void;
  changeTwClass: (twClass: ITailwindClass, newValue: string) => void;
}

const initialParsedCode = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);

export const useEditorManager = create<EditorManagerState>((set) => {
  const createEditorManager: EditorManagerState = {
    editorRef: createRef(),
    dom: initialParsedCode.dom,
    serializedDom: initialParsedCode.serializedDom,
    code: initialParsedCode.code,
    selectedElementTWId: null,
    codeUpdatedBy: null,
    updateCode: (newCode) => {
      set(({ codeUpdatedBy }) => {
        const parseNewCode = () => {
          const { dom, code, serializedDom } =
            domTools.parseHTMLString(newCode);
          if (codeUpdatedBy === "attributes") {
            set({
              dom,
              serializedDom,
              code,
              codeUpdatedBy: null,
            });
            return;
          }
          set({
            dom,
            serializedDom,
            code,
            codeUpdatedBy: null,
            selectedElementTWId: null,
          });
        };

        switch (codeUpdatedBy) {
          case "attributes":
          case "explorer":
          case "viewer":
            debounce(parseNewCode, 300)();
            break;
          default:
            parseNewCode();
        }

        return {};
      });
    },
    selectElement: (uuid) => {
      set(({ dom }) => {
        const selectedElement = domTools.getElementByUUID(dom, uuid);
        if (selectedElement) {
          const domNodeCodeLocation =
            elementSourceCodeLocationToIRange(selectedElement);
          createEditorManager.highlightCode(domNodeCodeLocation);
        }
        return { selectedElementTWId: uuid };
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
    insertCode: (code, range, insertedBy) => {
      if (!createEditorManager.editorRef.current) return;
      const editor = createEditorManager.editorRef.current;
      if (insertedBy) {
        set({ codeUpdatedBy: insertedBy });
      }
      editorTools.insertCode(editor, range, code);
    },
    insertHtmlElementCode: (type, range, insertedBy) => {
      if (!createEditorManager.editorRef.current) return;
      const editor = createEditorManager.editorRef.current;
      if (insertedBy) {
        set({ codeUpdatedBy: insertedBy });
      }
      editorTools.insertElements(editor, type, range);
    },
    changeTwClass: (twClass, newValue) => {
      createEditorManager.insertCode(
        newValue,
        domTools.sourceCodeLocationToIRange(twClass.sourceCodeLocation),
        "attributes",
      );
    },
  };
  return createEditorManager;
});
