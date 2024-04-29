import { Location } from "node_modules/parse5/dist/common/token";

export type SourceCodeLocation = Omit<Location, "startOffset" | "endOffset"> &
  Partial<Pick<Location, "startOffset" | "endOffset">>;
