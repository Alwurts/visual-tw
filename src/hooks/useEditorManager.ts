import { create } from "zustand";

import * as domTools from "@/lib/dom";
import * as editorTools from "@/lib/editor";
import * as classTools from "@/lib/classAttribute";
import * as dbTools from "@/lib/db/proxy";

//import DEFAULT_EDITOR_CODE from "../lib/editor/defaultEditorCode.html?raw";

import { createRef } from "react";
import { debounce } from "@/lib/utils";
import type { EditorManagerState } from "@/types/editor";

//const initialParsedCode = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);

// TODO Add html validation, show errors and prevent saving if there are errors
export const useEditorManager = create<EditorManagerState>((set, get) => ({
  project: null,
  loadProject: async (projectId) => {
    const project = await dbTools.getProject(projectId);
    if (project) {
      /* const currentCommit = await dbTools.getCommit(project.currentCommit);
      if (!currentCommit) return; */
      const autoSavedCode = project.autoSavedCode;
      set({
        project,
        codeUpdatedBy: { by: "monacoEditor", type: "INITIALIZE_PROJECT" },
      });
      get().updateCode(autoSavedCode);
      return { project, code: autoSavedCode };
    }
  },
  resetProject: () => {
    set({
      project: null,
      code: null,
      dom: null,
      serializedDom: null,
      selected: null,
      codeUpdatedBy: null,
    });
  },
  editorRef: createRef(),
  viewerRef: createRef(),
  dom: null,
  serializedDom: null,
  code: null,
  selected: null,
  codeUpdatedBy: null,
  updateCode: (newCode) => {
    const currentState = get();
    const codeUpdatedBy = currentState.codeUpdatedBy?.by;
    const codeUpdatedType = currentState.codeUpdatedBy?.type;
    const selected = currentState.selected;
    const projectId = currentState.project?.id;

    const parseNewCode = () => {
      const { dom, code, serializedDom } = domTools.parseHTMLString(newCode);

      // Which event to re-select the selected element
      let newSelected;
      if (codeUpdatedBy === "attributes" && selected) {
        const newSelectedElement = domTools.getElementByUUID(
          dom,
          selected.twId,
        );
        if (newSelectedElement) {
          const twClasses =
            classTools.parseElementClassAttribute(newSelectedElement);

          newSelected = {
            element: newSelectedElement,
            twId: selected.twId,
            class: twClasses ?? null,
          };
        }
      }

      set({
        dom,
        serializedDom,
        code,
        codeUpdatedBy: null,
        selected: newSelected ?? null,
      });

      // Which event to format code for
      switch (codeUpdatedBy) {
        case "attributes":
        case "explorer":
        case "viewer":
          if (codeUpdatedType !== "FORMAT_CODE") {
            get().formatEditorCode(codeUpdatedBy);
          }
          break;
      }

      if (projectId) {
        dbTools.updateProjectAutoSavedCode(projectId, newCode);
      }
    };

    // Which event to debounce or not
    if (
      codeUpdatedBy === undefined &&
      codeUpdatedType !== "FORMAT_CODE" &&
      codeUpdatedType !== "INITIALIZE_PROJECT"
    ) {
      debounce(parseNewCode, 700, "UPDATE_CODE")();
      return;
    }

    parseNewCode();
  },
  selectElement: (uuid) => {
    const currentState = get();

    if (!currentState.dom) return;

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
        currentState.highlightCode(domNodeCodeLocation);
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
    const editorRef = get().editorRef;
    if (!editorRef.current) return;
    const editor = editorRef.current;
    editor.setSelection(range);
    editor.revealPositionInCenter({
      lineNumber: range.startLineNumber,
      column: range.endColumn,
    });
  },
  formatEditorCode: (formatedBy) => {
    const editorRef = get().editorRef;
    if (!editorRef.current) return;
    const editor = editorRef.current;

    set({
      codeUpdatedBy: {
        by: formatedBy,
        type: "FORMAT_CODE",
      },
    });

    editorTools.formatEditorCode(editor);
  },
  deleteCode: (range, deletedBy) => {
    get().insertCode("", range, {
      by: deletedBy,
      type: "DELETE_CODE",
    });
  },
  insertCode: (code, range, codeUpdateBy) => {
    const editorRef = get().editorRef;
    if (!editorRef.current) return;
    const editor = editorRef.current;

    set({
      codeUpdatedBy: codeUpdateBy,
    });

    editorTools.insertCode(editor, range, code);
  },
  insertHtmlElementCode: (type, range, insertedBy) => {
    const editorRef = get().editorRef;
    if (!editorRef.current) return;
    const editor = editorRef.current;

    set({
      codeUpdatedBy: {
        by: insertedBy,
        type: "INSERT_HTML_ELEMENT",
      },
    });

    editorTools.insertElements(editor, type, range);
  },
  insertTwClass: (newTwClass, insertedBy) => {
    const currentState = get();
    const currentSelected = currentState.selected;

    if (currentSelected) {
      const currentSelectedName = currentSelected.element.nodeName;
      const currentClass = currentSelected.class;

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

        currentState.insertCode(
          " " + newTwClass,
          domTools.sourceCodeLocationToIRange({
            startLine: currentClass.sourceCodeLocation.endLine,
            startCol: currentClass.sourceCodeLocation.endCol - 1,
            endLine: currentClass.sourceCodeLocation.endLine,
            endCol: currentClass.sourceCodeLocation.endCol - 1,
          }),
          {
            by: insertedBy,
            type: "INSERT_TW_CLASS",
          },
        );
      } else if (currentSelected.element.sourceCodeLocation) {
        const newClass = ` class="${newTwClass}"`;
        const newClassRange = domTools.sourceCodeLocationToIRange({
          startLine: currentSelected.element.sourceCodeLocation.startLine,
          startCol:
            currentSelected.element.sourceCodeLocation.startCol +
            currentSelectedName.length +
            1,
          endLine: currentSelected.element.sourceCodeLocation.startLine,
          endCol:
            currentSelected.element.sourceCodeLocation.startCol +
            currentSelectedName.length +
            1,
        });

        currentState.insertCode(newClass, newClassRange, {
          by: insertedBy,
          type: "INSERT_TW_CLASS",
        });
      }
    }
  },
  changeTwClass: (twClass, newValue, changedBy) => {
    if (!twClass.sourceCodeLocation) return;
    get().insertCode(
      newValue,
      domTools.sourceCodeLocationToIRange(twClass.sourceCodeLocation),
      {
        by: changedBy,
        type: "CHANGE_TW_CLASS",
      },
    );
  },
  saveNewVersion: async (commitMessage) => {
    const viewerRef = get().viewerRef;
    const projectId = get().project?.id;
    const code = get().code;
    const serializedDom = get().serializedDom;
    if (!projectId || !viewerRef.current || !code || !serializedDom) return;
    const result = await dbTools.createNewCommit(
      code,
      commitMessage,
      commitMessage,
      projectId,
      serializedDom,
    );
    return result;
  },
}));
