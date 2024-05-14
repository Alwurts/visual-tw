export type ViewerElementSelected = {
  type: "viewer-element-selected";
  data: {
    uuid: string;
    boundingClientRect: DOMRect;
  };
};

export type ViewerSetOverlayShow = {
  type: "viewer-set-overlay-show";
  data: {
    newValue: boolean;
  };
};

export type ViewerSettingsRequest = {
  type: "viewer-settings-request";
};

export type ViewerSettingsResponse = {
  type: "viewer-settings-response";
  data: {
    showOverlay: boolean;
  };
};

export type ViewerMessage =
  | ViewerElementSelected
  | ViewerSetOverlayShow
  | ViewerSettingsRequest
  | ViewerSettingsResponse;
