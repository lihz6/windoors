import { useState, SyntheticEvent } from 'react';
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
  const [{ focusNode, innerNode }, setFocusNode] = useState<{
    focusNode: Node | null;
    innerNode: Node | null;
  }>({ focusNode: null, innerNode: null });
  const onNodeFocus = (event: SyntheticEvent, node: Node) => {
    event.stopPropagation();
    if (node.type === Type.PIPE) {
      return setFocusNode({ focusNode: node, innerNode: node });
    }
    const [target, ...uplist] = findNode(
      mainNode,
      focusNode ? focusNode.id : -1
    );
    if (uplist.length > 1 && containNode(target, node.id)) {
      setFocusNode({ focusNode: frameNode(uplist), innerNode: uplist[0] });
    } else {
      setFocusNode({
        focusNode: frameNode(findNode(mainNode, node.id) as NodeTree[]),
        innerNode: node,
      });
    }
  };
  return { innerNode, focusNode, onNodeFocus };
}
