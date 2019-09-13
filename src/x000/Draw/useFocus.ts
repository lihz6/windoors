import { useState } from 'react';
import {
  NodeMain,
  Node,
  Type,
  findNode,
  containNode,
  frameNode,
  NodeTree,
} from './struct';

export default function useFocus(mainNode: NodeMain) {
  const [{ focusNode, innerNode }, _setNode] = useState<{
    focusNode: Node | null;
    innerNode: Node | null;
  }>({ focusNode: null, innerNode: null });
  const setFocusNode = (node: Node | null) => {
    if (!node || node.type === Type.PIPE) {
      return _setNode({ focusNode: node, innerNode: node });
    }
    const [target, ...uplist] = findNode(
      mainNode,
      focusNode ? focusNode.id : -1
    );
    if (uplist.length > 1 && containNode(target, node.id)) {
      _setNode({ focusNode: frameNode(uplist), innerNode: uplist[0] });
    } else {
      _setNode({
        focusNode: frameNode(findNode(mainNode, node.id) as NodeTree[]),
        innerNode: node,
      });
    }
  };
  return { focusNode, setFocusNode, innerNode };
}
