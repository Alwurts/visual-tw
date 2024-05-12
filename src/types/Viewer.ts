export type ViewerElementSelected = {
  type: "viewer-element-selected";
  data: {
    uuid: string;
  };
};

export type ViewerSetOverlayShow = {
  type: "viewer-set-overlay-show";
  data: {
    newValue: boolean;
  };
};

export type ViewerMessage = ViewerElementSelected | ViewerSetOverlayShow;
