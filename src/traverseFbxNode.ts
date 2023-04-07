type Key =
  | {
      type: "array";
      index: number;
    }
  | {
      type: "object";
      name: string;
    };
export function traverseFbxNode<T>(
  node: any,
  callback: (node: any, keys: Key[]) => T | undefined,
  keys = [] as Key[]
): T | undefined {
  if (Array.isArray(node)) {
    let i = 0;
    for (const n of node) {
      const found = traverseFbxNode(n, callback, [
        ...keys,
        { type: "array", index: i },
        { type: "object", name: n.name },
      ]);
      i++;
      if (found) return found;
    }
  }
  const found = callback(node, keys);
  if (found) return found;
  if (node.nodes) {
    return traverseFbxNode(node.nodes, callback, keys);
  }
}
