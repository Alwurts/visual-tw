import { Node, TextNode } from "node_modules/parse5/dist/tree-adapters/default";
import * as parse5 from "parse5";
import DEFAULT_HEAD_CODE from "./editor/defaultHeadCode.html?raw";
import VIEWER_CODE from "./viewerInternal.js?raw";
import { IRange } from "monaco-editor";
import { SourceCodeLocation } from "@/types/parse5";

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

      // Disable links for the visualizer to work correctly
      if (node.tagName === "a") {
        const aHref = node.attrs.find((attr) => attr.name === "href");
        if (aHref) {
          aHref.value = "javascript:void(0)";
        }
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

export function sourceCodeLocationToIRange(
  sourceCodeLocation: SourceCodeLocation,
): IRange {
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

export function htmlTextWhitespaceHandling(text: string): string {
  return (
    text
      // Replace new lines and tabs with spaces
      .replace(/\s+/g, " ")
      // Trim leading and trailing whitespace
      .trim()
  );
}

export function trimValueAndUpdateLocation(textNode: TextNode): TextNode {
  const originalValue = textNode.value;
  const trimmedValue = originalValue.trim();

  if (textNode.sourceCodeLocation) {
    const leadingTrimmed = originalValue.substring(
      0,
      originalValue.length - originalValue.trimStart().length,
    );

    let leadingColTracker = textNode.sourceCodeLocation.startCol;
    let leadingLineTracker = textNode.sourceCodeLocation.startLine;
    let leadingOffsetTracker = textNode.sourceCodeLocation.startOffset;
    leadingTrimmed.split("").forEach((char) => {
      if (char === "\n") {
        leadingLineTracker++;
        leadingOffsetTracker++;
        leadingColTracker = 1;
      } else {
        leadingColTracker++;
        leadingOffsetTracker++;
      }
    });

    let trailingColTracker = leadingColTracker;
    let trailingLineTracker = leadingLineTracker;
    let trailingOffsetTracker = leadingOffsetTracker;
    trimmedValue.split("").forEach((char) => {
      if (char === "\n") {
        trailingLineTracker++;
        trailingOffsetTracker++;
        trailingColTracker = 1;
      } else {
        trailingColTracker++;
        trailingOffsetTracker++;
      }
    });

    return {
      ...textNode,
      value: trimmedValue,
      sourceCodeLocation: {
        startCol: leadingColTracker,
        startLine: leadingLineTracker,
        endCol: trailingColTracker,
        endLine: trailingLineTracker,
        startOffset: leadingOffsetTracker,
        endOffset: trailingOffsetTracker,
      },
    };
  }
  return {
    ...textNode,
    value: trimmedValue,
  };
}
