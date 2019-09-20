import {
  useState,
  useRef,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  NodeMain,
  Node,
  NodeFlex,
  Flow,
  Pipe,
  replaceNode,
  duplicate,
  NodeGrid,
  NodeArea,
  Type,
} from '_type/struct';
import { DrawProps } from '.';
export interface UseMnode {
  resizeNode(
    node: NodeArea | NodeFlex | NodeGrid,
    data: Pick<NodeGrid, 'template'> | Pick<NodeArea, 'grow' | 'size'>
  ): void;
  setMainNode: Dispatch<SetStateAction<NodeMain>>;
  newNodeId(): number;
  setMainNodeData: any;
  mainNode: NodeMain;
}
export default function useMnode(props: DrawProps): UseMnode {
  const newId = useRef(Date.now());
  const [mainNode, setMainNode] = useState<NodeMain>(initMnode(props, newId));
  const newNodeId = () => newId.current--;

  const setMainNodeData = ({ position, ...data }) => {
    const { children } = mainNode;
    const pos = children.map(({ type }) => Number(type === Type.PIPE)).join('');
    if (pos === position) {
      setMainNode({ ...mainNode, ...data });
    } else {
      setMainNode({
        ...mainNode,
        ...data,
        children: openChildren(children, pos, position, newId),
      });
    }
  };
  const resizeNode: UseMnode['resizeNode'] = (node, data) => {
    const newNode = { ...node, ...data };
    setMainNode(replaceNode(mainNode, node, newNode));
  };
  return {
    setMainNodeData,
    setMainNode,
    resizeNode,
    newNodeId,
    mainNode,
  };
}

function openChildren(
  children: Node[],
  oldPosition: string,
  newPosition: string,
  newId: MutableRefObject<number>
): Node[] {
  if (oldPosition === newPosition) {
    return children;
  }
  const data = {
    '0': children.find(({ type }) => type !== Type.LOCK),
    '1': children.find(({ type }) => type === Type.LOCK),
  };

  return newPosition.split('').map((n, i) => {
    const node = data[n] || {
      id: newId.current--,
      type: Type.LOCK,
    };
    if (newPosition.slice(0, i).includes(n)) {
      return duplicate(node, () => newId.current--);
    }
    return node;
  });
}

function initMnode(
  { position, ...props }: DrawProps,
  newId: MutableRefObject<number>
): NodeMain {
  return {
    ...props,
    version: 1,
    id: newId.current--,
    type: Type.MAIN,
    children: openChildren(
      [
        { id: newId.current--, type: Type.LOCK },
        {
          id: newId.current--,
          type: Type.FLEX,
          flow: Flow.L2R,
          size: 0,
          grow: 1,
          children: [
            { id: newId.current--, type: Type.PIPE, pipe: Pipe.W5H5 },
            {
              id: newId.current--,
              type: Type.FLEX,
              flow: Flow.T2B,
              size: 0,
              grow: 1,
              children: [
                { id: newId.current--, type: Type.PIPE, pipe: Pipe.W5H5 },
                {
                  id: newId.current--,
                  type: Type.AREA,
                  size: 0,
                  grow: 1,
                },
                { id: newId.current--, type: Type.PIPE, pipe: Pipe.W5H5 },
              ],
            },
            { id: newId.current--, type: Type.PIPE, pipe: Pipe.W5H5 },
          ],
        },
      ],
      '10',
      position,
      newId
    ),
  };
}
