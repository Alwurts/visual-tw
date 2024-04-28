import { Node, Document } from "node_modules/parse5/dist/tree-adapters/default";
import * as parse5 from "parse5";
import DEFAULT_HEAD_CODE from "./editor/defaultHeadCode.html?raw";
import VIEWER_CODE from "./viewer.js?raw";
import { IRange } from "monaco-editor";
import { ITailwindClass } from "@/types/tailwind/base";

export function parseHTMLString(html: string) {
  const document = parse5.parse(html, {
    sourceCodeLocationInfo: true,
  });

  traverseDocument(document, (node) => {
    if ("attrs" in node) {
      if (node.tagName === "head") {
        const defaultHeadNode = parse5.parseFragment(DEFAULT_HEAD_CODE);
        node.childNodes = defaultHeadNode.childNodes;

        const scriptNode = parse5.parseFragment(
          `<script>${VIEWER_CODE}</script>`,
        );
        node.childNodes.push(scriptNode.childNodes[0]);
      }

      if (node.sourceCodeLocation) {
        const nodeIdentifier = `${node.sourceCodeLocation.startLine}-${node.sourceCodeLocation.startCol}`;

        node.attrs.push({
          name: "visual-tw-id",
          value: nodeIdentifier,
        });
      }
    }
  });

  const serializedDom = parse5.serialize(document);

  return {
    code: html,
    serializedDom: serializedDom,
    dom: document,
  };
}

export const traverseDocument = (
  document: Node,
  callback: (node: Node) => void,
) => {
  const traverse = (node: Node) => {
    callback(node);
    if ("childNodes" in node) {
      node.childNodes.forEach(traverse);
    }
  };
  traverse(document);
};

export function getElementByUUID(dom: Node, uuid: string): Node | null {
  let result: Node | null = null;

  function traverse(node: Node) {
    if (
      "attrs" in node &&
      node.attrs.some(
        (attr) => attr.name === "visual-tw-id" && attr.value === uuid,
      )
    ) {
      result = node;
      return;
    }

    if ("childNodes" in node) {
      for (const child of node.childNodes) {
        traverse(child);
        if (result) return;
      }
    }
  }

  traverse(dom);
  return result;
}

export function elementSourceCodeLocationToIRange(element: Node): IRange {
  if (!element.sourceCodeLocation) {
    return {
      startLineNumber: 0,
      startColumn: 0,
      endLineNumber: 0,
      endColumn: 0,
    };
  }
  return sourceCodeLocationToIRange(element.sourceCodeLocation);
}

export function sourceCodeLocationToIRange(sourceCodeLocation: {
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
}): IRange {
  if (
    !sourceCodeLocation ||
    !sourceCodeLocation.startLine ||
    !sourceCodeLocation.startCol ||
    !sourceCodeLocation.endLine ||
    !sourceCodeLocation.endCol
  ) {
    return {
      startLineNumber: 0,
      startColumn: 0,
      endLineNumber: 0,
      endColumn: 0,
    };
  }

  return {
    startLineNumber: sourceCodeLocation.startLine,
    startColumn: sourceCodeLocation.startCol,
    endLineNumber: sourceCodeLocation.endLine,
    endColumn: sourceCodeLocation.endCol,
  };
}

export function getElementsByTagName(dom: Node, tagName: string) {
  const result: Node[] = [];

  function traverse(node: Node) {
    if ("tagName" in node && node.tagName === tagName) {
      result.push(node);
    }
    if ("childNodes" in node) {
      for (const child of node.childNodes || []) {
        traverse(child);
      }
    }
  }

  traverse(dom);
  return result;
}

export function getElementAttributeValue(node: Node, attrName: string) {
  if ("attrs" in node) {
    const attr = node.attrs.find((attr) => attr.name === attrName);
    return attr?.value;
  }
}

export function setElementAttributeValue(
  node: Node,
  attrName: string,
  value: string,
) {
  if ("attrs" in node) {
    const attr = node.attrs.find((attr) => attr.name === attrName);
    if (attr) {
      attr.value = value;
    } else {
      node.attrs.push({ name: attrName, value });
    }
  }
}

export function getElementVisualTwId(node: Node) {
  return getElementAttributeValue(node, "visual-tw-id");
}

export function changeElementTWClass(
  dom: Document,
  uuid: string,
  twClass: ITailwindClass,
  newValue: string,
) {
  const node = getElementByUUID(dom, uuid);
  if (!node) return;

  const classAttribute = getElementAttributeValue(node, "class");
  if (!classAttribute) return;

  const newClassAttribute = classAttribute.replace(twClass.value, newValue);

  setElementAttributeValue(node, "class", newClassAttribute);

  updateSourceCodeLocation(dom, twClass, newValue);

  return { dom, node };
}

function updateSourceCodeLocation(
  dom: Node,
  twClass: ITailwindClass,
  newValue: string,
) {
  const changeFromLine = twClass.sourceCodeLocation.endLine;
  const changeFromCol = twClass.sourceCodeLocation.endCol;

  const offset = newValue.length - twClass.value.length;
  const modifyDom = (node: Node) => {
    const nodeSourceCodeLocation = node.sourceCodeLocation;

    if (nodeSourceCodeLocation) {
      if (nodeSourceCodeLocation.startLine === changeFromLine) {
        if (nodeSourceCodeLocation.startCol > changeFromCol) {
          nodeSourceCodeLocation.startCol += offset;
        }
      }

      if (nodeSourceCodeLocation.endLine === changeFromLine) {
        if (nodeSourceCodeLocation.endCol > changeFromCol) {
          nodeSourceCodeLocation.endCol += offset;
        }
      }

      if ("attrs" in nodeSourceCodeLocation && nodeSourceCodeLocation.attrs) {
        Object.values(nodeSourceCodeLocation.attrs).forEach(
          (attrSourceCodeLocation) => {
            if (attrSourceCodeLocation.startLine === changeFromLine) {
              if (attrSourceCodeLocation.startCol > changeFromCol) {
                attrSourceCodeLocation.startCol += offset;
              }
            }

            if (attrSourceCodeLocation.endLine === changeFromLine) {
              if (attrSourceCodeLocation.endCol > changeFromCol) {
                attrSourceCodeLocation.endCol += offset;
              }
            }
          },
        );

        if (nodeSourceCodeLocation.startTag) {
          const startTagSourceCodeLocation = nodeSourceCodeLocation.startTag;
          if (startTagSourceCodeLocation.startLine === changeFromLine) {
            if (startTagSourceCodeLocation.startCol > changeFromCol) {
              startTagSourceCodeLocation.startCol += offset;
            }
          }

          if (startTagSourceCodeLocation.endLine === changeFromLine) {
            if (startTagSourceCodeLocation.endCol > changeFromCol) {
              startTagSourceCodeLocation.endCol += offset;
            }
          }
        }

        if (nodeSourceCodeLocation.endTag) {
          const endTagSourceCodeLocation = nodeSourceCodeLocation.endTag;
          if (endTagSourceCodeLocation.startLine === changeFromLine) {
            if (endTagSourceCodeLocation.startCol > changeFromCol) {
              endTagSourceCodeLocation.startCol += offset;
            }
          }

          if (endTagSourceCodeLocation.endLine === changeFromLine) {
            if (endTagSourceCodeLocation.endCol > changeFromCol) {
              endTagSourceCodeLocation.endCol += offset;
            }
          }
        }
      }
    }

    if ("childNodes" in node) {
      node.childNodes.forEach(modifyDom);
    }
  };

  modifyDom(dom);
}
