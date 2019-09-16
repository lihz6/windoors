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
    focusNode: Node[];
    innerNode: Node[];
  }>({ focusNode: [], innerNode: [] });
  const setFocusNode = (node: Node | null) => {
    if (!node) {
      return _setNode({ focusNode: [], innerNode: [] });
    }
    if (node.type === Type.PIPE) {
      const nodes = findNode(mainNode, node.id);
      return _setNode({ focusNode: nodes, innerNode: nodes });
    }
    const [target, ...uplist] = findNode(
      mainNode,
      focusNode.length && focusNode[0].id
    );
    if (uplist.length > 1 && containNode(target, node.id)) {
      _setNode({ focusNode: frameNode(uplist), innerNode: uplist });
    } else {
      const nodes = findNode(mainNode, node.id);
      _setNode({
        focusNode: frameNode(nodes as NodeTree[]),
        innerNode: nodes,
      });
    }
  };
  return { focusNode, setFocusNode, innerNode };
}
