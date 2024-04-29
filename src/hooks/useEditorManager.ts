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
import { ActionResponse, TWindowTabs } from "@/types/EditorManager";
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
  updateCode: (newCode: string) => ActionResponse;
  selectElement: (uuid: string) => ActionResponse;
  highlightCode: (range: IRange) => ActionResponse;
  insertCode: (
    code: string,
    range: IRange,
    insertedBy: TWindowTabs,
  ) => ActionResponse;
  insertHtmlElementCode: (
    type: "h1" | "h2" | "h3" | "div" | "span" | "p",
    range: IRange,
    insertedBy: TWindowTabs,
  ) => ActionResponse;
  insertTwClass: (
    newTwClass: string,
    insertedBy: TWindowTabs,
  ) => ActionResponse;
  changeTwClass: (
    twClass: ITailwindClass,
    newValue: string,
    changedBy: TWindowTabs,
  ) => ActionResponse;
}

const initialParsedCode = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);

export const useEditorManager = create<EditorManagerState>((set, get) => {
  const createEditorManager: EditorManagerState = {
    editorRef: createRef(),
    dom: initialParsedCode.dom,
    serializedDom: initialParsedCode.serializedDom,
    code: initialParsedCode.code,
    selected: null,
    codeUpdatedBy: null,
    updateCode: (newCode) => {
      const currentState = get();
      const codeUpdatedBy = currentState.codeUpdatedBy;
      const selected = currentState.selected;

      const parseNewCode = () => {
        const { dom, code, serializedDom } = domTools.parseHTMLString(newCode);

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
    },
    selectElement: (uuid) => {
      const currentState = get();

      const newSelectedElement = domTools.getElementByUUID(
        currentState.dom,
        uuid,
      );

      if (newSelectedElement) {
        // On selecting an element, highlight the code
        if (newSelectedElement.sourceCodeLocation) {
          const domNodeCodeLocation = domTools.sourceCodeLocationToIRange(
            newSelectedElement.sourceCodeLocation,
          );
          createEditorManager.highlightCode(domNodeCodeLocation);
        }

        const twClasses =
          classTools.parseElementClassAttribute(newSelectedElement);

        set({
          selected: {
            element: newSelectedElement,
            twId: uuid,
            class: twClasses ?? null,
          },
        });
      }
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
    insertTwClass: (newTwClass, insertedBy) => {
      const currentState = get();
      const currentClass = currentState.selected?.class;

      if (currentClass && currentClass.sourceCodeLocation) {
        const classExists = classTools.checkClassIfClassExists(
          currentClass.classes,
          newTwClass,
        );

        if (classExists) {
          return {
            message: "Class already exists",
            isError: true,
          };
        }

        createEditorManager.insertCode(
          " " + newTwClass,
          domTools.sourceCodeLocationToIRange({
            startLine: currentClass.sourceCodeLocation.endLine,
            startCol: currentClass.sourceCodeLocation.endCol - 1,
            endLine: currentClass.sourceCodeLocation.endLine,
            endCol: currentClass.sourceCodeLocation.endCol - 1,
          }),
          insertedBy,
        );
      }
    },
    changeTwClass: (twClass, newValue, changedBy) => {
      if (!twClass.sourceCodeLocation) return;
      createEditorManager.insertCode(
        newValue,
        domTools.sourceCodeLocationToIRange(twClass.sourceCodeLocation),
        changedBy,
      );
    },
  };
  return createEditorManager;
});
