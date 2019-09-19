import { useState, useRef, MutableRefObject } from 'react';
import {
  NodeMain,
  Node,
  findNode,
  containNode,
  Type,
  NodeFlex,
  Flow,
  NodePipe,
  Pipe,
  replaceNode,
  clearNode,
  deleteNode,
  duplicateNode,
  duplicate,
  NodeGrid,
  NodeArea,
} from './struct';
import chunk from 'lodash/chunk';
import { DrawProps } from '.';
import { Border } from '_view/DrawGridBox';
export interface UseMnode {
  addBorderToNode(border: Border, innerNode: Node[]): void;
  addFromGrid(node: Node | null, column: number, area: number[]): void;
  duplicateNodeById(clearId: number): void;
  deleteNodeById(deleteId: number): void;
  clearNodeById(clearId: number): void;
  setMainNodeData: any;
  mainNode: NodeMain;
}
export default function useMnode(props: DrawProps): UseMnode {
  const newId = useRef(Date.now());
  const [mainNode, setMainNode] = useState<NodeMain>(initMnode(props, newId));
  const addFromGrid: UseMnode['addFromGrid'] = (node, column, area) => {
    if (node && node.type === Type.AREA && column && column <= area.length) {
      const newNode = newNodeOf(node, column, area, newId);
      setMainNode(replaceNode(mainNode, node, newNode));
    }
  };
  const clearNodeById: UseMnode['clearNodeById'] = clearId => {
    setMainNode(clearNode(mainNode, clearId));
  };
  const deleteNodeById: UseMnode['deleteNodeById'] = (deleteId: number) => {
    setMainNode(deleteNode(mainNode, deleteId));
  };
  const duplicateNodeById: UseMnode['deleteNodeById'] = (
    duplicateId: number
  ) => {
    setMainNode(duplicateNode(mainNode, duplicateId, () => newId.current--));
  };
  const addBorderToNode = (border: Border, innerNode: Node[]) => {
    const [oldNode, newNode] = addBorder(border, innerNode as any, newId);
    setMainNode(replaceNode(mainNode, oldNode, newNode));
  };
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
  return {
    duplicateNodeById,
    setMainNodeData,
    addBorderToNode,
    deleteNodeById,
    clearNodeById,
    addFromGrid,
    mainNode,
  };
}

/////////////////////////////////////////////////////////
//                                                     //
/////////////////// Helping Functions ///////////////////
//                                                     //
/////////////////////////////////////////////////////////

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
  const children: Node[] = [
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
  ];
  return {
    ...props,
    version: 1,
    id: newId.current--,
    type: Type.MAIN,
    children: openChildren(children, '10', position, newId),
  };
}

function addBorder(
  border: Border,
  innerNode: [NodeArea, Node],
  newId: MutableRefObject<number>
): [Node, Node] {
  const [oldNode, parent] = innerNode as [NodeArea, ...Node[]];
  const borderFlow = { top: Flow.T2B, bottom: Flow.T2B }[border] || Flow.L2R;
  const addBorderNode = (children: Node[]) => {
    const borderNode: NodePipe = {
      id: newId.current--,
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
    id: newId.current--,
    type: Type.FLEX,
    size: oldNode.size || 0,
    grow: oldNode.grow || 1,
    flow: borderFlow,
    children: addBorderNode([{ ...oldNode, size: 0, grow: 1 }]),
  };
  return [oldNode, newNode];
}

function newNodeOf(
  node: NodeArea,
  column: number,
  area: number[],
  newId: MutableRefObject<number>
) {
  if (column === 1 || column === area.length) {
    const newNode: NodeFlex = {
      ...node,
      id: newId.current--,
      type: Type.FLEX,
      flow: column === 1 ? Flow.T2B : Flow.L2R,
      children: area
        .reduce(
          (a, b) => {
            if (a.length && a[a.length - 1][0] === b) {
              a[a.length - 1].push(b);
            } else {
              a.push([b]);
            }
            return a;
          },
          [] as number[][]
        )
        .map(a => a.length)
        .reduce(
          (a, b, i) => {
            if (i !== 0) {
              a.push({
                id: newId.current--,
                type: Type.PIPE,
                pipe: Pipe['W5H5'],
              });
            }
            a.push({
              id: newId.current--,
              type: Type.AREA,
              size: 0,
              grow: b,
            });
            return a;
          },
          [] as Node[]
        ),
    };
    return newNode;
  }
  const chunks = chunk(
    area.reduce<[number[], number[]]>(
      ([l1, l2], b) => {
        const index = l2.findIndex(v => v === b);
        if (index > -1) {
          l1.push(index);
        } else {
          l1.push(l2.push(b) - 1);
        }
        return [l1, l2];
      },
      [[], []]
    )[0],
    column
  );
  if (chunks.slice(-1)[0].length !== column) {
    return node;
  }
  const newNode: NodeGrid = {
    ...node,
    id: newId.current--,
    type: Type.GRID,
    column: column * 2,
    template: Array.from({ length: (column + chunks.length) * 2 }).map(
      (_, i) => (i + 1) % 2
    ),
    area: chunks.reduce<number[]>((a, b) => {
      const c = b.reduce<number[]>((a, b) => [...a, b, b], []);
      return [...a, ...c, ...c];
    }, []),

    children: area
      .filter((a, i) => a === i)
      .map(() => ({
        id: newId.current--,
        type: Type.AREA,
        grow: 0,
        size: 0,
      })),
  };
  return newNode;
}
