import { SourceCodeLocation } from "@/types/parse5";

type StylesLayout = "Display" | "Overflow";

type StylesTypography = "Text_Align" | "Text_Color" | "Font_Size" | "Font_Weight";

type StylesBackgrounds = "BackgroundColor";

export type SubCategoryNames =
  | StylesLayout
  | StylesTypography
  | StylesBackgrounds
  | "Other";

export type CategoryName =
  | "Layout"
  | "Flexbox_and_Grid"
  | "Spacing"
  | "Sizing"
  | "Typography"
  | "Backgrounds"
  | "Borders"
  | "Effects"
  | "Other";

export type TailwindRegexPatterns = {
  [key in CategoryName]?: {
    [key in SubCategoryNames]?: RegExp;
  };
};

type ITailwindClassBase = {
  value: string;
  sourceCodeLocation?: SourceCodeLocation;
};

export type ITailwindClassClassified = {
  category: CategoryName;
  subcategory: SubCategoryNames;
} & ITailwindClassBase;

export type ITailwindClass = ITailwindClassBase | ITailwindClassClassified;

export type classesClassified = {
  [key in SubCategoryNames]?: ITailwindClassClassified[];
};
