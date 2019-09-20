import { ReactEventHandler, Dispatch, SetStateAction } from 'react';
import { NodeMain, Node, Type, deleteNode, NodeArea } from '_type/struct';
export default function useDelete(
  setMainNode: Dispatch<SetStateAction<NodeMain>>,
  focusNode: Node[]
): [boolean, ReactEventHandler] {
  const [current, parent] = focusNode;
  const canDelete =
    parent &&
    parent.type === Type.FLEX &&
    current.type !== Type.PIPE &&
    current.type !== Type.BONE &&
    // @ts-ignore
    parent.children.filter((n: NodeArea) => n.grow && n.id !== current.id)
      .length;
  return [
    !canDelete,
    () => {
      canDelete && setMainNode(root => deleteNode(root, current.id));
    },
  ];
}
