export interface CodeBlock {
  sourceCodeLocation: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
  tagName: string;
}
