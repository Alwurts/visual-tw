import { create } from "zustand";

import * as domTools from "../lib/dom";

import DEFAULT_EDITOR_CODE from "../lib/editor/defaultEditorCode.html?raw";

import type { Node } from "node_modules/parse5/dist/tree-adapters/default";

interface EditorManagerState {
  dom: Node;
  serializedDom: string;
  code: string;
  selectedElement: Node | null;
  updateCode: (newCode: string) => void;
  selectElement: (uuid: string) => void;
}

export const useEditorManager = create<EditorManagerState>((set) => {
  const initialParsedCode = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);
  const createState: EditorManagerState = {
    dom: initialParsedCode.dom,
    serializedDom: initialParsedCode.serializedDom,
    code: initialParsedCode.code,
    selectedElement: null,
    updateCode: (newCode: string) => {
      const { code, dom, serializedDom } = domTools.parseHTMLString(newCode);
      set({ code, dom, serializedDom, selectedElement: null });
    },
    selectElement: (uuid: string) => {
      set(({ dom }) => {
        const selectedElement = domTools.getElementByUUID(dom, uuid);
        return { selectedElement };
      });
    },
  };
  return createState;
});
