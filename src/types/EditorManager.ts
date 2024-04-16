import type { DefaultTreeAdapterMap } from "parse5";

type CodeUpdate = {
  type: "code-update";
  data: {
    code: string;
    dom: DefaultTreeAdapterMap["node"];
    serializedDom: string;
  };
};

type ElementSelected = {
  type: "element-selected";
  data: {
    uuid: string;
  };
};

export type EditorNotification = CodeUpdate | ElementSelected;
