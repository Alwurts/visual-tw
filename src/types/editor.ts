import type {
  Document,
  Node,
} from "node_modules/parse5/dist/tree-adapters/default";
import type { IRange, editor as monacoEditor } from "monaco-editor";
import { ITailwindClass } from "@/types/tailwind";
import * as classTools from "@/lib/classAttribute";
import { Commit, Project } from "@/lib/db/indexdb";

const windowTabs = [
  "explorer",
  "monacoEditor",
  "viewer",
  "attributes",
  "versionControl",
] as const;

export type TWindowTabs = (typeof windowTabs)[number];

export type WindowManager = {
  left: {
    [K in TWindowTabs]?: boolean;
  };
  right: {
    [K in TWindowTabs]?: boolean;
  };
  center: {
    [K in TWindowTabs]?: boolean;
  };
};

export type UpdateCodeEvent = {
  by: TWindowTabs;
  type:
    | "INITIALIZE_PROJECT"
    | "INSERT_HTML_ELEMENT"
    | "INSERT_CODE"
    | "FORMAT_CODE"
    | "DELETE_CODE"
    | "INSERT_TW_CLASS"
    | "CHANGE_TW_CLASS"
    | "CHANGE_NODE_TEXT";
};

export type ActionResponse = {
  message: string;
  isError: boolean;
} | void;

export interface EditorManagerState {
  project: Project | null;
  loadProject: (projectId: string) => Promise<{
    project: Project;
    code: string;
  } | void>;
  resetProject: () => void;
  editorRef: React.MutableRefObject<monacoEditor.IStandaloneCodeEditor | null>;
  viewerRef: React.MutableRefObject<HTMLIFrameElement | null>;
  dom: Document | null;
  serializedDom: string | null;
  code: string | null;
  selected: {
    element: Node;
    twId: string;
    class: ReturnType<typeof classTools.parseElementClassAttribute> | null;
  } | null;
  codeUpdatedBy: UpdateCodeEvent | null;
  updateCode: (newCode: string) => ActionResponse;
  selectElement: (uuid: string) => ActionResponse;
  highlightCode: (range: IRange) => ActionResponse;
  formatEditorCode: (formatedBy: TWindowTabs) => void;
  deleteCode: (range: IRange, deletedBy: TWindowTabs) => ActionResponse;
  insertCode: (
    code: string,
    range: IRange,
    codeUpdateBy: UpdateCodeEvent,
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
  saveNewVersion: (commitMessage: string) => Promise<Commit[] | void>;
}
