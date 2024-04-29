import { create } from "zustand";

import * as domTools from "@/lib/dom";
import * as editorTools from "@/lib/editor";
import * as classTools from "@/lib/classAttribute";

import DEFAULT_EDITOR_CODE from "../lib/editor/defaultEditorCode.html?raw";

import type {
  Document,
  Node,
} from "node_modules/parse5/dist/tree-adapters/default";
import { createRef } from "react";
import type { IRange, editor as monacoEditor } from "monaco-editor";
import { TWindowTabs } from "@/types/EditorManager";
import { ITailwindClass } from "@/types/tailwind/base";
import { debounce } from "@/lib/utils";

interface EditorManagerState {
  editorRef: React.MutableRefObject<monacoEditor.IStandaloneCodeEditor | null>;
  dom: Document;
  serializedDom: string;
  code: string;
  selected: {
    element: Node;
    twId: string;
    class: ReturnType<typeof classTools.parseElementClassAttribute> | null;
  } | null;
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
  //insertTwClass: (newTwClass: string) => void;
  changeTwClass: (twClass: ITailwindClass, newValue: string) => void;
}

const initialParsedCode = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);

export const useEditorManager = create<EditorManagerState>((set) => {
  const createEditorManager: EditorManagerState = {
    editorRef: createRef(),
    dom: initialParsedCode.dom,
    serializedDom: initialParsedCode.serializedDom,
    code: initialParsedCode.code,
    selected: null,
    codeUpdatedBy: null,
    updateCode: (newCode) => {
      set(({ codeUpdatedBy, selected }) => {
        const parseNewCode = () => {
          const { dom, code, serializedDom } =
            domTools.parseHTMLString(newCode);

          // Do not reset the selected element if the code was updated by the attributes panel
          if (selected && codeUpdatedBy === "attributes") {
            const newSelectedElement = domTools.getElementByUUID(
              dom,
              selected.twId,
            );
            if (newSelectedElement) {
              const twClasses =
                classTools.parseElementClassAttribute(newSelectedElement);

              set({
                dom,
                serializedDom,
                code,
                selected: {
                  element: newSelectedElement,
                  twId: selected.twId,
                  class: twClasses ?? null,
                },
                codeUpdatedBy: null,
              });
              return;
            }
          }

          set({
            dom,
            serializedDom,
            code,
            codeUpdatedBy: null,
            selected: null,
          });
        };

        switch (codeUpdatedBy) {
          case "attributes":
          case "explorer":
          case "viewer":
            parseNewCode();
            break;
          case "monacoEditor":
          default:
            debounce(parseNewCode, 700, "updateCode")();
        }

        return {};
      });
    },
    selectElement: (uuid) => {
      set(({ dom }) => {
        const selectedElement = domTools.getElementByUUID(dom, uuid);

        if (selectedElement) {
          // On selecting an element, highlight the code
          if (selectedElement.sourceCodeLocation) {
            const domNodeCodeLocation = domTools.sourceCodeLocationToIRange(
              selectedElement.sourceCodeLocation,
            );
            createEditorManager.highlightCode(domNodeCodeLocation);
          }

          const twClasses =
            classTools.parseElementClassAttribute(selectedElement);

          return {
            selectedElementTWId: uuid,
            selected: {
              element: selectedElement,
              twId: uuid,
              class: twClasses ?? null,
            },
          };
        }

        return {};
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
    /* insertTwClass: (newTwClass) => {
      const classExists = classTools.checkClassIfClassExists();
      createEditorManager.insertCode(
        twClass.value,
        domTools.sourceCodeLocationToIRange(twClass.sourceCodeLocation),
        "attributes",
      );
    }, */
    changeTwClass: (twClass, newValue) => {
      if (!twClass.sourceCodeLocation) return;
      createEditorManager.insertCode(
        newValue,
        domTools.sourceCodeLocationToIRange(twClass.sourceCodeLocation),
        "attributes",
      );
    },
  };
  return createEditorManager;
});
