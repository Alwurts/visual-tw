export type TtailwindClass = {
  value: string;
  category?: string;
  sourceCodeLocation: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
};

type CategoryName =
  | "Layout"
  | "Flexbox"
  | "Grid"
  | "Spacing"
  | "Sizing"
  | "Typography"
  | "Colors"
  | "Borders"
  | "Effects"
  | "Filters"
  | "Transitions and Animation"
  | "Behaviors"
  | "SVG"
  | "Accessibility"
  | "Uncategorized";

type CategoryPatterns = {
  [key in CategoryName]?: RegExp;
};

type CategorizedClasses = {
  [key in CategoryName]: TtailwindClass[];
};

// Define patterns for different categories using the CategoryName type
const patterns: CategoryPatterns = {
  Layout:
    /\b(container|display|position|overflow|overscroll|visible|invisible)-?[0-9a-z]*\b/g,
  Flexbox: /\b(flex|items|justify|align|self|grow|shrink)-?[0-9a-z]*\b/g,
  Grid: /\b(grid|gap|row|col)-?[0-9a-z]*\b/g,
  Spacing: /\b(p|m|space)(x|y|t|r|b|l)?-[0-9]+[a-z]*\b/g,
  Sizing: /\b(w|h|max|min|fill|screen)-[0-9a-z]+\b/g,
  Typography:
    /\b(text|font|leading|tracking|break|truncate|align|whitespace|decoration)-[0-9a-z]*\b/g,
  Colors: /\b(bg|text|fill|stroke|color)-[0-9a-z]*\b/g,
  Borders: /\b(border|rounded|divide|ring)-[0-9a-z]*\b/g,
  Effects: /\b(shadow|opacity|mix-blend)-[0-9a-z]*\b/g,
  Filters:
    /\b(filter|blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)-[0-9a-z]*\b/g,
  "Transitions and Animation":
    /\b(transition|animate|duration|ease|delay)-[0-9a-z]*\b/g,
  Behaviors:
    /\b(appearance|cursor|outline|pointer|resize|select|user)-[0-9a-z]*\b/g,
  SVG: /\b(fill|stroke)-[0-9a-z]*\b/g,
  Accessibility: /\b(sr-only|not-sr-only|focus)-[0-9a-z]*\b/g,
};

// Function to categorize classes
export function categorizeClasses(
  tailwindClasses: TtailwindClass[],
): CategorizedClasses {
  const categorizedClasses: CategorizedClasses = {
    Layout: [],
    Spacing: [],
    Flexbox: [],
    Typography: [],
    Grid: [],
    Colors: [],
    Borders: [],
    Effects: [],
    Accessibility: [],
    Filters: [],
    Sizing: [],
    Behaviors: [],
    "Transitions and Animation": [],
    SVG: [],
    Uncategorized: [],
  };

  tailwindClasses.forEach((tailwindClass) => {
    let found = false;
    for (const category in patterns) {
      if (patterns[category as CategoryName]?.test(tailwindClass.value)) {
        categorizedClasses[category as CategoryName].push({
          ...tailwindClass,
          category: category as CategoryName,
        });
        found = true;
        break;
      }
    }
    if (!found) {
      categorizedClasses["Uncategorized"].push({
        ...tailwindClass,
        category: "Uncategorized",
      });
    }
  });

  return categorizedClasses;
}
