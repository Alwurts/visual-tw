import { Node } from "node_modules/parse5/dist/tree-adapters/default";
import * as parse5 from "parse5";
import { v4 as uuidv4 } from "uuid";
import DEFAULT_HEAD_CODE from "./editor/defaultHeadCode.html?raw";
import VIEWER_CODE from "./viewer.js?raw";
import { IRange } from "monaco-editor";

export function parseHTMLString(html: string) {
  const document = parse5.parse(html, {
    sourceCodeLocationInfo: true,
  });

  traverseDocument(document, (node) => {
    const nodeIdentifier = uuidv4();

    if ("attrs" in node) {
      node.attrs.push({
        name: "visual-tw-id",
        value: nodeIdentifier,
      });

      if (node.tagName === "head") {
        const defaultHeadNode = parse5.parseFragment(DEFAULT_HEAD_CODE);
        node.childNodes = defaultHeadNode.childNodes;
      }

      if (node.tagName === "head") {
        const scriptNode = parse5.parseFragment(
          `<script>${VIEWER_CODE}</script>`,
        );
        node.childNodes.push(scriptNode.childNodes[0]);
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

export function getElementSourceCodeLocation(
  dom: Node,
  uuid: string,
): IRange | null {
  const node = getElementByUUID(dom, uuid);
  if (!node) {
    return null;
  }

  const sourceCodeLocation = node.sourceCodeLocation;

  if (
    !sourceCodeLocation ||
    !sourceCodeLocation.startLine ||
    !sourceCodeLocation.startCol ||
    !sourceCodeLocation.endLine ||
    !sourceCodeLocation.endCol
  ) {
    return null;
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

export function getElementAttribute(node: Node, attrName: string) {
  if ("attrs" in node) {
    const attr = node.attrs.find((attr) => attr.name === attrName);
    return attr?.value;
  }
}

export function getElementVisualTwId(node: Node) {
  return getElementAttribute(node, "visual-tw-id");
}
