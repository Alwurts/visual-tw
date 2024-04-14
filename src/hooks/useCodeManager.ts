import { useEffect, useReducer } from "react";
import * as parse5 from "parse5";
import { traverseParse5Document } from "../utils/parseDom";
import { CodeBlock } from "../types/Code";
import renderScript from "../utils/render.js?raw";

interface CodeBlockTracker {
  [key: string]: CodeBlock;
}

interface State {
  code: string;
  parsedCode: string;
  //codeBlockTracker: CodeBlockTracker;
}

type Action =
  | { type: "setCode"; payload: string }
  | { type: "setParsedCode"; payload: string }
  | { type: "setCodeBlockTracker"; payload: CodeBlockTracker };

const initialState: State = {
  code: "",
  parsedCode: "",
  //codeBlockTracker: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setCode":
      return { ...state, code: action.payload };
    case "setParsedCode":
      return { ...state, parsedCode: action.payload };
    /* case "setCodeBlockTracker":
      return { ...state, codeBlockTracker: action.payload }; */
    default:
      return state;
  }
}

const useCodeManager = (initialCode: string) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    code: initialCode,
  });

  useEffect(() => {
    const document = parse5.parse(state.code, { sourceCodeLocationInfo: true });

    const updatedCodeBlockTracker: CodeBlockTracker = {};

    traverseParse5Document(document, (node) => {
      if (node.tagName && node.sourceCodeLocation) {
        const { tagName } = node;
        const { startLine, startCol, endLine, endCol } =
          node.sourceCodeLocation;

        const codeBlockIdentifier = `${startLine}-${startCol}-${endLine}-${endCol}`;

        updatedCodeBlockTracker[codeBlockIdentifier] = {
          sourceCodeLocation: {
            startLine,
            startCol,
            endLine,
            endCol,
          },
          tagName,
        };

        node.attrs.push({
          name: "re-id",
          value: codeBlockIdentifier,
        });

        if (node.tagName === "body") {
          const scriptNode = parse5.parseFragment(
            `<script>${renderScript}</script>`
          );
          node.childNodes.push(scriptNode.childNodes[0]);
        }
      }
    });


    const updatedHtml = parse5.serialize(document);

    console.log(updatedHtml);

    dispatch({ type: "setCodeBlockTracker", payload: updatedCodeBlockTracker });
    dispatch({ type: "setParsedCode", payload: updatedHtml });
  }, [state.code]);

  const setCode = (code: string) =>
    dispatch({ type: "setCode", payload: code });

  /* const selectCodeBlock = useCallback((id: string) => {
    // Implement the logic to highlight the selected code block
  }, []); */

  return { setCode, ...state };
};

export default useCodeManager;
