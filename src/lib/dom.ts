import type { DefaultTreeAdapterMap } from "parse5";

export type Node = DefaultTreeAdapterMap["node"];

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