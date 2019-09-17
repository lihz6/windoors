import { useState, useEffect } from 'react';
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
  const _setFocusNode = (node: Node | null, focusNode: Node[]) => {
    if (!node) {
      return { focusNode: [], innerNode: [] };
    }
    if (node.type === Type.PIPE) {
      const nodes = findNode(mainNode, node.id);
      return { focusNode: nodes, innerNode: nodes };
    }
    const [target, ...uplist] = findNode(
      mainNode,
      focusNode.length && focusNode[0].id
    );
    if (uplist.length > 1 && containNode(target, node.id)) {
      return { focusNode: frameNode(uplist), innerNode: uplist };
    } else {
      const nodes = findNode(mainNode, node.id);
      return {
        focusNode: frameNode(nodes as NodeTree[]),
        innerNode: nodes,
      };
    }
  };
  const setFocusNode = (node: Node | null) => {
    _setNode(_setFocusNode(node, focusNode));
  };
  useEffect(() => {
    _setNode(({ focusNode, innerNode }) => {
      if (innerNode.length) {
        return _setFocusNode(innerNode[0], []);
      }
      return { focusNode, innerNode };
    });
  }, [mainNode]);
  return { focusNode, setFocusNode, innerNode };
}
