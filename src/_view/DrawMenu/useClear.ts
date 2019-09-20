import { ReactEventHandler, Dispatch, SetStateAction } from 'react';
import { NodeMain, Node, Type, treeNode, NodeTree } from '_type/struct';
export default function useClear(
  setMainNode: Dispatch<SetStateAction<NodeMain>>,
  focusNode: Node[]
): [boolean, ReactEventHandler] {
  const [current] = focusNode;
  const canClear =
    current && [Type.FLEX, Type.GRID, Type.BONE].includes(current.type);
  if (canClear && current.type === Type.BONE) {
    return [
      !canClear,
      () => {
        throw 'Not implemented';
      },
    ];
  }
  return [
    !canClear,
    () => {
      canClear && setMainNode(root => clearNode(root, current.id));
    },
  ];
}

function clearNode<T extends NodeTree>(root: T, clearId: number): T {
  return treeNode(root, node => {
    if (node.id !== clearId) {
      return node;
    }
    return {
      id: node.id,
      type: Type.AREA,
      // @ts-ignore
      size: node.size,
      // @ts-ignore
      grow: node.grow,
      // no children
    };
  });
}
