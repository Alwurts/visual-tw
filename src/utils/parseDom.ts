/* eslint-disable @typescript-eslint/no-explicit-any */
export const traverseParse5Document = (
  document: any,
  callback: (node: any) => void,
) => {
  const traverse = (node: Node) => {
    callback(node);
    if (node.childNodes) {
      node.childNodes.forEach(traverse);
    }
  };
  traverse(document);
};

export function findNodeById(dom: any, id: string): any {
  let result: any = null;

  function traverse(node: any) {
    if (
      node.attrs &&
      node.attrs.some(
        (attr: any) => attr.name === "visual-tw-id" && attr.value === id,
      )
    ) {
      result = node;
      return;
    }

    for (const child of node.childNodes || []) {
      traverse(child);
      if (result) return;
    }
  }

  traverse(dom);
  return result;
}

export function findNodeByTagName(dom: any, tagName: string) {
  let result: any = null;

  function traverse(node: any) {
    if (node.tagName === tagName) {
      result = node;
      return;
    }

    for (const child of node.childNodes || []) {
      traverse(child);
      if (result) return;
    }
  }

  traverse(dom);
  return result;
}
