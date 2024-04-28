import {
  CategoryName,
  ITailwindClass,
  SubCategoryNames,
  TailwindClassesClassified,
  TailwindRegexPatterns,
} from "@/types/tailwind/base";

const tailwindPatterns: TailwindRegexPatterns = {
  Typography: {
    Text_Align: /\b(text-left|text-center|text-right|text-justify)\b/g,
  },
  Backgrounds: {
    Background_Color: /\b(bg-[a-zA-Z]+(?:-\d+)?)\b/g,
  },
};

function classifyTailwindClass(twClass: ITailwindClass): ITailwindClass {
  let tailwindClassCategoryFound = false;
  Object.entries(tailwindPatterns).some(([category, subcategories]) => {
    return Object.entries(subcategories).some(([subcategory, pattern]) => {
      if (pattern.test(twClass.value)) {
        tailwindClassCategoryFound = true;
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

  if (!tailwindClassCategoryFound) {
    return {
      ...twClass,
      category: "Other",
      subcategory: "Other",
    };
  }

  return twClass;
}

export function splitClassAttributeIntoClasses(classAttribute: {
  value: string;
  sourceCodeLocation: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
}): TailwindClassesClassified {
  let columnTracker = classAttribute.sourceCodeLocation.startCol + 7;
  const classStrings = classAttribute.value.split(" ");

  const parsedValuesSubCategories: TailwindClassesClassified = {};
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

    //console.log("tempTWClass", tempTWClass);

    if (tempTWClass.value !== "") {
      const classifiedTWClass = classifyTailwindClass(tempTWClass);
      console.log("classifiedTWClass", classifiedTWClass);

      if (!parsedValuesSubCategories[classifiedTWClass.subcategory!]) {
        parsedValuesSubCategories[classifiedTWClass.subcategory!] = [];
      }

      parsedValuesSubCategories[classifiedTWClass.subcategory!]?.push(
        classifiedTWClass,
      );
    }
  });

  console.log("parsedValuesSubCategories", parsedValuesSubCategories);

  return parsedValuesSubCategories;
}
