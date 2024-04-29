import { SourceCodeLocation } from "@/types/parse5";
import {
  CategoryName,
  ITailwindClass,
  SubCategoryNames,
  classesClassified,
  TailwindRegexPatterns,
  ITailwindClassClassified,
} from "@/types/tailwind/base";
import { Node } from "node_modules/parse5/dist/tree-adapters/default";

const tailwindPatterns: TailwindRegexPatterns = {
  Typography: {
    Text_Align: /\b(text-left|text-center|text-right|text-justify)\b/g,
  },
  Backgrounds: {
    Background_Color: /\b(bg-[a-zA-Z]+(?:-\d+)?)\b/g,
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

      return twClasses;
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
