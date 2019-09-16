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
  NodeGrid,
  NodeArea,
} from './struct';
import { data } from './data';
import chunk from 'lodash/chunk';
export interface UseMnode {
  addFromGrid(node: Node | null, column: number, area: number[]): void;
  duplicateNodeById(clearId: number): void;
  deleteNodeById(deleteId: number): void;
  clearNodeById(clearId: number): void;
  mainNode: NodeMain;
}
export default function useMnode(): UseMnode {
  const newId = useRef(Date.now() + 10000);
  const [mainNode, setMainNode] = useState<NodeMain>(data);
  const addFromGrid: UseMnode['addFromGrid'] = (node, column, area) => {
    if (
      !node ||
      node.type !== Type.AREA ||
      column < 1 ||
      column > area.length
    ) {
      return;
    }
    setMainNode(
      replaceNode(mainNode, node, newNodeOf(node, column, area, newId))
    );
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

  return {
    mainNode,
    addFromGrid,
    clearNodeById,
    deleteNodeById,
    duplicateNodeById,
  };
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
