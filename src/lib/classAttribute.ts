import { SourceCodeLocation } from "@/types/parse5";
import {
  CategoryName,
  ITailwindClass,
  SubCategoryNames,
  classesClassified,
  TailwindRegexPatterns,
  ITailwindClassClassified,
} from "@/types/tailwind";
import { Node } from "node_modules/parse5/dist/tree-adapters/default";

const tailwindPatterns: TailwindRegexPatterns = {
  Layout: {
    Display:
      /\b(block|inline-block|inline|flex|inline-flex|table|inline-table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row-group|table-row|flow-root|grid|inline-grid|contents|list-item|hidden)\b/g,
    Overflow:
      /\b(overflow-(auto|hidden|clip|visible|scroll)|overflow-(x|y)-(auto|hidden|clip|visible|scroll))\b/g,
  },
  Typography: {
    Text_Align: /\b(text-left|text-center|text-right|text-justify)\b/g,
    Text_Color:
      /\b(text-(transparent|black|white|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-(?:50|100|200|300|400|500|600|700|800|900|950))?))\b/g,
    Font_Size: /\b(text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl))\b/g,
    Font_Weight:
      /\b(font-(hairline|thin|light|normal|medium|semibold|bold|extrabold|black))\b/g,
  },
  Backgrounds: {
    BackgroundColor:
      /\b(?:bg-(?:inherit|current|transparent|black|white|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-(?:50|100|200|300|400|500|600|700|800|900|950))?))\b/,
  },
};

function classifyTailwindClass(
  twClass: ITailwindClass,
): ITailwindClassClassified {
  Object.entries(tailwindPatterns).some(([category, subcategories]) => {
    return Object.entries(subcategories).some(([subcategory, pattern]) => {
      if (pattern.test(twClass.value)) {
        twClass = {
          ...twClass,
          category: category as CategoryName,
          subcategory: subcategory as SubCategoryNames,
        };
        return true;
      }
      return false;
    });
  });

  if ("category" in twClass && twClass.category && twClass.subcategory) {
    return twClass;
  }

  return {
    ...twClass,
    category: "Other",
    subcategory: "Other",
  };
}

function splitClassAttributeStringIntoClasses(classAttribute: {
  value: string;
  sourceCodeLocation: SourceCodeLocation;
}): classesClassified {
  let columnTracker = classAttribute.sourceCodeLocation.startCol + 7;
  const classStrings = classAttribute.value.split(" ");

  const parsedValuesSubCategories: classesClassified = {};
  classStrings.forEach((classString) => {
    const startCol = columnTracker;
    columnTracker += classString.length + 1;
    const endCol = columnTracker - 1;

    const tempTWClass: ITailwindClass = {
      value: classString,
      sourceCodeLocation: {
        startLine: classAttribute.sourceCodeLocation.startLine,
        startCol: startCol,
        endLine: classAttribute.sourceCodeLocation.endLine,
        endCol: endCol,
      },
    };

    if (tempTWClass.value !== "") {
      const classifiedTWClass = classifyTailwindClass(tempTWClass);

      if (!parsedValuesSubCategories[classifiedTWClass.subcategory]) {
        parsedValuesSubCategories[classifiedTWClass.subcategory] = [];
      }

      parsedValuesSubCategories[classifiedTWClass.subcategory]?.push(
        classifiedTWClass,
      );
    }
  });

  return parsedValuesSubCategories;
}

export function parseElementClassAttribute(element: Node) {
  if ("attrs" in element) {
    const classAttribute = element.attrs.find((attr) => attr.name === "class")
      ?.value;

    const classAttributeSourceCodeLocation =
      element.sourceCodeLocation?.attrs?.class;

    if (classAttribute && classAttributeSourceCodeLocation) {
      const twClasses = splitClassAttributeStringIntoClasses({
        value: classAttribute,
        sourceCodeLocation: classAttributeSourceCodeLocation,
      });

      return {
        value: classAttribute,
        sourceCodeLocation: classAttributeSourceCodeLocation,
        classes: twClasses,
      };
    }
  }
}

export function checkClassIfClassExists(
  currentClasses: classesClassified,
  newClassValue: string,
): ITailwindClass | null {
  let foundClass: ITailwindClass | null = null;

  const classifiedNewClass = classifyTailwindClass({
    value: newClassValue,
  });

  // If we already have a tailwind class of that subcategory like Background_Color
  if (classifiedNewClass.subcategory !== "Other") {
    const subcategory = currentClasses[classifiedNewClass.subcategory];
    if (subcategory && subcategory.length > 0) {
      return subcategory[0];
    }
  }

  // If we don't have a tailwind class of that subcategory like Background_Color
  // then check if any of the other classes has the same value
  Object.values(currentClasses).some((twClasses) => {
    return twClasses.some((twClass) => {
      if (twClass.value === newClassValue) {
        foundClass = twClass;
        return true;
      }
      return false;
    });
  });

  return foundClass;
}
