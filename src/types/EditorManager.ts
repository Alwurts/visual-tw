import { Node } from "node_modules/parse5/dist/tree-adapters/default";

type CodeUpdate = {
  type: "code-update";
  data: {
    code: string;
    dom: Node;
    serializedDom: string;
  };
};

export const ElementSelectedTypes = [
  "viewer-element-selected",
  "editor-element-selected",
  "explorer-element-selected",
] as const;

type ElementSelected = {
  type: (typeof ElementSelectedTypes)[number];
  data: {
    uuid: string;
  };
};

export function isNotificationElementSelected(
  notification: EditorNotification,
): notification is ElementSelected {
  return (ElementSelectedTypes as ReadonlyArray<string>).includes(
    notification.type,
  );
}

export type EditorNotification = CodeUpdate | ElementSelected;

const windowTabs = ["explorer", "code", "viewer", "attributes"] as const;

export type TWindowTabs = (typeof windowTabs)[number];
