import { Dispatch, SetStateAction } from 'react';
import {
  NodeArea,
  Node,
  Flow,
  NodePipe,
  Type,
  Pipe,
  NodeFlex,
  NodeMain,
  replaceNode,
  deleteNode,
} from '_type/struct';
import { Border } from '.';

export default function useBorder(
  setMainNode: Dispatch<SetStateAction<NodeMain>>,
  focusNode: Node[],
  innerNode: Node[],
  newId: () => number
): [boolean, (border: Border, node: Node | undefined) => void] {
  const bordered = focusNode[1] && focusNode[1].type !== Type.FLEX;
  return [
    !bordered,
    (border, node) => {
      if (bordered) {
        if (node) {
          return setMainNode(root => deleteNode(root, node.id));
        }
        const [oldNode, newNode] = addBorder(border, innerNode as any, newId);
        setMainNode(root => replaceNode(root, oldNode, newNode));
      }
    },
  ];
}

function addBorder(
  border: Border,
  innerNode: [NodeArea, Node],
  newId: () => number
): [Node, Node] {
  const [oldNode, parent] = innerNode as [NodeArea, ...Node[]];
  const borderFlow = { top: Flow.T2B, bottom: Flow.T2B }[border] || Flow.L2R;
  const addBorderNode = (children: Node[]) => {
    const borderNode: NodePipe = {
      id: newId(),
      type: Type.PIPE,
      pipe: Pipe['W5H5'],
    };
    if (['top', 'left'].includes(border)) {
      return [borderNode, ...children];
    } else {
      return [...children, borderNode];
    }
  };
  if (parent.type === Type.FLEX && parent.flow === borderFlow) {
    const newNode: NodeFlex = {
      ...parent,
      children: addBorderNode(parent.children),
    };
    return [parent, newNode];
  }
  const newNode: NodeFlex = {
    id: newId(),
    type: Type.FLEX,
    size: oldNode.size || 0,
    grow: oldNode.grow || 1,
    flow: borderFlow,
    children: addBorderNode([{ ...oldNode, size: 0, grow: 1 }]),
  };
  return [oldNode, newNode];
}
