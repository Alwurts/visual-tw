export type ViewerMessage = {
  type: "viewer-element-selected";
  data: {
    uuid: string;
  };
};

const windowTabs = [
  "explorer",
  "monacoEditor",
  "viewer",
  "attributes",
] as const;

export type TWindowTabs = (typeof windowTabs)[number];

export type ActionResponse = {
  message: string;
  isError: boolean;
} | void;
