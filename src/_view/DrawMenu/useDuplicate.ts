import { ReactEventHandler, Dispatch, SetStateAction } from 'react';
import {
  NodeMain,
  Node,
  Type,
  treeNode,
  NodeTree,
  duplicate,
} from '_type/struct';
export default function useDuplicate(
  setMainNode: Dispatch<SetStateAction<NodeMain>>,
  focusNode: Node[],
  newId: () => number
): [boolean, ReactEventHandler] {
  const [current, parent] = focusNode;
  const canDuplicate =
    parent && parent.type === Type.FLEX && current.type !== Type.PIPE;
  return [
    !canDuplicate,
    () => {
      canDuplicate &&
        setMainNode(root => duplicateNode(root, current.id, newId));
    },
  ];
}

export function duplicateNode<T extends NodeTree>(
  root: T,
  duplicateId: number,
  newId: (oldId: number) => number
): T {
  return treeNode(root, node => {
    if (
      node.type !== Type.FLEX ||
      node.children.every(({ id }) => id !== duplicateId)
    ) {
      return node;
    }
    const index = node.children.findIndex(({ id }) => id === duplicateId);
    const children = node.children.slice();
    const startIndex = index && index - 1;
    const dups = children
      .slice(startIndex, startIndex + 2)
      .map(node => duplicate(node, newId));
    children.splice(startIndex, 0, ...dups);
    return {
      ...node,
      children,
    };
  });
}
