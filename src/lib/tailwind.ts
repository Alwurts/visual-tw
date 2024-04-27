import {
  CategoryName,
  ITailwindClass,
  SubCategoryNames,
  TailwindClassesClassified,
  TailwindClassifierPatterns,
} from "@/types/tailwind/base";

const tailwindPatterns: TailwindClassifierPatterns = {
  Layout: {
    Container: /\bcontainer-?[0-9a-z]*\b/g,
    Box_Sizing: /\b(box-content|box-border)\b/g,
    Display:
      /\b(block|inline-block|inline|flex|inline-flex|table|inline-table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|flow-root|grid|inline-grid|contents|hidden)\b/g,
    Overflow:
      /\b(overflow-auto|overflow-hidden|overflow-visible|overflow-scroll|overflow-x-auto|overflow-y-auto|overflow-x-hidden|overflow-y-hidden|overflow-x-visible|overflow-y-visible|overflow-x-scroll|overflow-y-scroll)\b/g,
    Position: /\b(static|fixed|absolute|relative|sticky)\b/g,
    "Top/Right/Bottom/Left":
      /\b(inset|inset-x|inset-y|top|right|bottom|left)-?[0-9a-z]*\b/g,
    Visibility: /\b(visible|invisible)\b/g,
    ZIndex: /\b(z-[0-9]+)\b/g,
  },
  Flexbox_and_Grid: {
    Flex_Direction:
      /\b(flex-row|flex-row-reverse|flex-col|flex-col-reverse)\b/g,
    Flex_Wrap: /\b(flex-wrap|flex-wrap-reverse|flex-nowrap)\b/g,
    Flex: /\b(flex-1|flex-auto|flex-initial|flex-none)\b/g,
    Flex_Grow: /\b(flex-grow|flex-grow-0)\b/g,
    Flex_Shrink: /\b(flex-shrink|flex-shrink-0)\b/g,
    Order: /\border-[0-9]+\b/g,
    Gap: /\bgap-[0-9]+\b/g,
    Justify_Content:
      /\b(justify-start|justify-end|justify-center|justify-between|justify-around|justify-evenly)\b/g,
    Justify_Items:
      /\b(justify-items-start|justify-items-end|justify-items-center|justify-items-stretch)\b/g,
    Justify_Self:
      /\b(justify-self-auto|justify-self-start|justify-self-end|justify-self-center|justify-self-stretch)\b/g,
    Align_Content:
      /\b(align-content-start|align-content-end|align-content-center|align-content-between|align-content-around|align-content-evenly|align-content-stretch)\b/g,
    Align_Items:
      /\b(align-items-start|align-items-end|align-items-center|align-items-baseline|align-items-stretch)\b/g,
    Align_Self:
      /\b(align-self-auto|align-self-start|align-self-end|align-self-center|align-self-baseline|align-self-stretch)\b/g,
    Place_Content:
      /\b(place-content-center|place-content-start|place-content-end|place-content-between|place-content-around|place-content-evenly|place-content-stretch)\b/g,
    Place_Items:
      /\b(place-items-auto|place-items-start|place-items-end|place-items-center|place-items-stretch)\b/g,
    Place_Self:
      /\b(place-self-auto|place-self-start|place-self-end|place-self-center|place-self-stretch)\b/g,
  },
  Spacing: {
    Padding: /\bp-[0-9]+\b/g,
    Margin: /\bm-[0-9]+\b/g,
    Space_Between: /\b(space-x-[0-9]+|space-y-[0-9]+)\b/g,
  },
  Sizing: {
    Width: /\bw-[0-9]+\b/g,
    "Min-Width": /\bmin-w-[0-9]+\b/g,
    "Max-Width": /\bmax-w-[0-9]+\b/g,
    Height: /\bh-[0-9]+\b/g,
    "Min-Height": /\bmin-h-[0-9]+\b/g,
    "Max-Height": /\bmax-h-[0-9]+\b/g,
  },
  Typography: {
    Font_Family: /\b(font-sans|font-serif|font-mono)\b/g,
    Font_Size:
      /\b(text-[0-9]+|text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl|text-4xl|text-5xl|text-6xl|text-7xl|text-8xl|text-9xl)\b/g,
    Font_Style: /\b(italic|not-italic)\b/g,
    Font_Weight:
      /\b(font-thin|font-extralight|font-light|font-normal|font-medium|font-semibold|font-bold|font-extrabold|font-black)\b/g,
    Letter_Spacing:
      /\b(tracking-[0-9]+|tracking-tighter|tracking-tight|tracking-normal|tracking-wide|tracking-wider|tracking-widest)\b/g,
    Line_Height:
      /\b(leading-[0-9]+|leading-none|leading-tight|leading-snug|leading-normal|leading-relaxed|leading-loose)\b/g,
    List_Style_Type: /\b(list-none|list-disc|list-decimal)\b/g,
    Placeholder_Color:
      /\b(placeholder-transparent|placeholder-current|placeholder-black|placeholder-white|placeholder-gray|placeholder-red|placeholder-yellow|placeholder-green|placeholder-blue|placeholder-indigo|placeholder-purple|placeholder-pink)\b/g,
    Text_Align: /\b(text-left|text-center|text-right|text-justify)\b/g,
    Text_Color:
      /\b(text-transparent|text-current|text-black|text-white|text-gray|text-red|text-yellow|text-green|text-blue|text-indigo|text-purple|text-pink)\b/g,
    Text_Opacity: /\b(text-opacity-[0-9]+)\b/g,
    Text_Decoration: /\b(underline|line-through|no-underline)\b/g,
    Text_Transform:
      /\b(normal-case|uppercase|lowercase|capitalize|truncate)\b/g,
    Text_Overflow: /\b(overflow-ellipsis|overflow-clip)\b/g,
    Vertical_Align:
      /\b(align-baseline|align-top|align-middle|align-bottom|align-text-top|align-text-bottom)\b/g,
    Whitespace:
      /\b(whitespace-normal|whitespace-no-wrap|whitespace-pre|whitespace-pre-line|whitespace-pre-wrap)\b/g,
    Word_Break: /\b(break-normal|break-words|break-all)\b/g,
  },
  Backgrounds: {
    Background_Attachment: /\b(bg-fixed|bg-local|bg-scroll)\b/g,
    Background_Color: /\b(bg-[a-zA-Z]+(?:-\d+)?)\b/g,
    Background_Opacity: /\b(bg-opacity-[0-9]+)\b/g,
    Background_Position:
      /\b(bg-bottom|bg-center|bg-left|bg-left-bottom|bg-left-top|bg-right|bg-right-bottom|bg-right-top|bg-top)\b/g,
    Background_Repeat: /\b(bg-repeat|bg-no-repeat|bg-repeat-x|bg-repeat-y)\b/g,
    Background_Size: /\b(bg-auto|bg-cover|bg-contain)\b/g,
  },
  Borders: {
    Border_Radius:
      /\b(rounded-[0-9]+|rounded-none|rounded-sm|rounded|rounded-md|rounded-lg|rounded-xl|rounded-2xl|rounded-3xl|rounded-full)\b/g,
    Border_Width:
      /\b(border-[0-9]+|border|border-t|border-r|border-b|border-l)\b/g,
    Border_Color:
      /\b(border-transparent|border-current|border-black|border-white|border-gray|border-red|border-yellow|border-green|border-blue|border-indigo|border-purple|border-pink)\b/g,
    Border_Opacity: /\b(border-opacity-[0-9]+)\b/g,
    Border_Style:
      /\b(border-solid|border-dashed|border-dotted|border-double|border-none)\b/g,
    Divide_Width: /\b(divide-[0-9]+|divide-x-[0-9]+|divide-y-[0-9]+)\b/g,
    Divide_Color:
      /\b(divide-transparent|divide-current|divide-black|divide-white|divide-gray|divide-red|divide-yellow|divide-green|divide-blue|divide-indigo|divide-purple|divide-pink)\b/g,
    Divide_Opacity: /\b(divide-opacity-[0-9]+)\b/g,
    Ring_Width: /\b(ring-[0-9]+|ring-inset)\b/g,
    Ring_Color:
      /\b(ring-transparent|ring-current|ring-black|ring-white|ring-gray|ring-red|ring-yellow|ring-green|ring-blue|ring-indigo|ring-purple|ring-pink)\b/g,
    Ring_Opacity: /\b(ring-opacity-[0-9]+)\b/g,
    Ring_Offset_Width: /\b(ring-offset-[0-9]+)\b/g,
    Ring_Offset_Color:
      /\b(ring-offset-transparent|ring-offset-current|ring-offset-black|ring-offset-white|ring-offset-gray|ring-offset-red|ring-offset-yellow|ring-offset-green|ring-offset-blue|ring-offset-indigo|ring-offset-purple|ring-offset-pink)\b/g,
  },
  Effects: {
    Box_Shadow:
      /\b(shadow-sm|shadow|shadow-md|shadow-lg|shadow-xl|shadow-2xl|shadow-inner|shadow-none)\b/g,
    Opacity: /\b(opacity-[0-9]+)\b/g,
  },
};

export function classAttributeToTwClasses(classAttribute: {
  value: string;
  sourceCodeLocation: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
}): ITailwindClass[] {
  let currentIndex = 7;
  return classAttribute.value.split(" ").map((className) => {
    const startPosition = currentIndex;
    const endPosition = startPosition + className.length;
    currentIndex = endPosition + 1;

    return {
      value: className,
      sourceCodeLocation: {
        startLine: classAttribute.sourceCodeLocation.startLine,
        startCol: classAttribute.sourceCodeLocation.startCol + startPosition,
        endLine: classAttribute.sourceCodeLocation.endLine,
        endCol: classAttribute.sourceCodeLocation.startCol + endPosition,
      },
    };
  });
}

// Function to categorize classes
export function categorizeTailwindClasses(tailwindClasses: ITailwindClass[]) {
  const categorizedClasses = {
    Backgrounds: {},
    Layout: {},
    Flexbox_and_Grid: {},
    Spacing: {},
    Sizing: {},
    Typography: {},
    Borders: {},
    Effects: {},
    Other: {},
  } as TailwindClassesClassified;

  tailwindClasses.forEach((tailwindClass) => {
    let tailwindClassCategoryFound = false;
    Object.entries(tailwindPatterns).forEach(([category, subcategories]) => {
      const categoryName = category as CategoryName;
      Object.entries(subcategories).forEach(([subcategory, pattern]) => {
        const subCategoryName = subcategory as SubCategoryNames;
        if (categoryName !== "Other" && pattern.test(tailwindClass.value)) {
          if (!categorizedClasses[categoryName]) {
            categorizedClasses[categoryName] = {};
          }
          if (!categorizedClasses[categoryName][subCategoryName]) {
            categorizedClasses[categoryName][subCategoryName] = [];
          }
          categorizedClasses[categoryName][subCategoryName].push({
            ...tailwindClass,
            category: categoryName,
            subcategory: subCategoryName,
          });
          tailwindClassCategoryFound = true;
        }
      });
    });

    if (!tailwindClassCategoryFound) {
      if (!categorizedClasses.Other) {
        categorizedClasses.Other = {};
      }
      if (!categorizedClasses.Other[tailwindClass.value]) {
        categorizedClasses.Other[tailwindClass.value] = [];
      }
      categorizedClasses.Other[tailwindClass.value].push({
        ...tailwindClass,
        category: "Other",
      });
    }
  });

  return categorizedClasses;
}
