type StylesLayout =
  | "Container"
  | "Box_Sizing"
  | "Display"
  | "Overflow"
  | "Position"
  | "Top/Right/Bottom/Left"
  | "Visibility"
  | "ZIndex";

type StylesFlexboxAndGrid =
  | "Flex_Direction"
  | "Flex_Wrap"
  | "Flex"
  | "Flex_Grow"
  | "Flex_Shrink"
  | "Order"
  | "Gap"
  | "Justify_Content"
  | "Justify_Items"
  | "Justify_Self"
  | "Align_Content"
  | "Align_Items"
  | "Align_Self"
  | "Place_Content"
  | "Place_Items"
  | "Place_Self";

type StylesSpacing = "Padding" | "Margin" | "Space_Between";

type StylesSizing =
  | "Width"
  | "Min-Width"
  | "Max-Width"
  | "Height"
  | "Min-Height"
  | "Max-Height";

type StylesTypography =
  | "Font_Family"
  | "Font_Size"
  | "Font_Style"
  | "Font_Weight"
  | "Letter_Spacing"
  | "Line_Height"
  | "List_Style_Type"
  | "Placeholder_Color"
  | "Text_Align"
  | "Text_Color"
  | "Text_Opacity"
  | "Text_Decoration"
  | "Text_Transform"
  | "Text_Overflow"
  | "Vertical_Align"
  | "Whitespace"
  | "Word_Break";

type StylesBackgrounds =
  | "Background_Attachment"
  | "Background_Color"
  | "Background_Opacity"
  | "Background_Position"
  | "Background_Repeat"
  | "Background_Size";

type StylesBorders =
  | "Border_Radius"
  | "Border_Width"
  | "Border_Color"
  | "Border_Opacity"
  | "Border_Style"
  | "Divide_Width"
  | "Divide_Color"
  | "Divide_Opacity"
  | "Ring_Width"
  | "Ring_Color"
  | "Ring_Opacity"
  | "Ring_Offset_Width"
  | "Ring_Offset_Color";

type StylesEffects = "Box_Shadow" | "Opacity";

export type SubCategoryNames =
  | StylesLayout
  | StylesFlexboxAndGrid
  | StylesSpacing
  | StylesSizing
  | StylesTypography
  | StylesBackgrounds
  | StylesBorders
  | StylesEffects
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
  sourceCodeLocation?: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
};

export type ITailwindClassClassified = {
  category: CategoryName;
  subcategory: SubCategoryNames;
} & ITailwindClassBase;

export type ITailwindClass = ITailwindClassBase | ITailwindClassClassified;

export type classesClassified = {
  [key in SubCategoryNames]?: ITailwindClassClassified[];
};
