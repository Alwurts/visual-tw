export const traverseParse5Document = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (node: any) => void
) => {
  const traverse = (node: Node) => {
    callback(node);
    if (node.childNodes) {
      node.childNodes.forEach(traverse);
    }
  };
  traverse(document);
};
