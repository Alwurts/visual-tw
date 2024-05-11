export type ViewerMessage = {
  type: "viewer-element-selected";
  data: {
    uuid: string;
  };
};