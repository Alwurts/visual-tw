export type ViewerElementHoveredMessage = {
  type: "elementhovered";
  data: {
    id: string;
    name: string;
  };
};

export type ViewerMessage = ViewerElementHoveredMessage;
