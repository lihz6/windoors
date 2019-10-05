import { Dispatch, SetStateAction } from 'react';
import {
  NodeArea,
  NodeFlex,
  Type,
  Flow,
  NodeGrid,
  NodeMain,
  replaceNode,
  Pipe,
  Node,
} from '_type/struct';
import chunk from 'lodash/chunk';
import { DrawGridProps } from '../DrawGrid';
export default function useDrawGrid(
  setMainNode: Dispatch<SetStateAction<NodeMain>>,
  innerNode: Node[],
  newId: () => number
): [boolean, DrawGridProps['onDone']] {
  const [current, parent] = innerNode;
  const enabled = parent && current.type === Type.AREA;
  return [
    !enabled,
    (column: number, area: number[]) => {
      if (
        enabled &&
        column &&
        column <= area.length &&
        column * area.length > 1 &&
        area.length % column === 0
      ) {
        const [oldNode, newNode] = oldNewNode(
          // @ts-ignore
          current,
          parent,
          column,
          area,
          newId
        );
        setMainNode(root => replaceNode(root, oldNode, newNode));
      }
    },
  ];
}

function oldNewNode(
  current: NodeArea,
  parent: Node,
  column: number,
  area: number[],
  newId: () => number
): [Node, Node] {
  if (column === 1 || column === area.length) {
    const newNode = newNodeFlex(current, column, area, newId);
    // Code 1
    return [current, newNode];
    // Code 2
    // if (parent.type !== Type.FLEX || parent.flow !== newNode.flow) {
    //   return [current, newNode];
    // }
    // return [parent, concatNode(newNode, parent)];
  }
  return [current, newNodeGrid(current, column, area, newId)];
}

function newNodeFlex(
  node: NodeArea,
  column: number,
  area: number[],
  newId: () => number
): NodeFlex {
  return {
    ...node,
    type: Type.FLEX,
    flow: column === 1 ? Flow.T2B : Flow.L2R,
    children: area
      .reduce<number[][]>((a, b) => {
        if (a.length && a[a.length - 1][0] === b) {
          a[a.length - 1].push(b);
        } else {
          a.push([b]);
        }
        return a;
      }, [])
      .map(a => a.length)
      .reduce<Node[]>((a, b, i) => {
        if (i !== 0) {
          a.push({
            id: newId(),
            type: Type.PIPE,
            pipe: Pipe['W5H5'],
          });
        }
        a.push({
          id: newId(),
          type: Type.AREA,
          size: 0,
          grow: b,
        });
        return a;
      }, []),
  };
}

function concatNode(current: NodeFlex, parent: NodeFlex) {
  const { grow, size, children } = current;
  const total = children.reduce((a, b) => {
    if (b.type === Type.AREA) {
      return a + b.grow;
    }
    return a;
  }, 0);
  return {
    ...parent,
    id: current.id,
    children: parent.children.reduce<Node[]>((a, b) => {
      if (b.id === current.id) {
        return a.concat(
          children.map(node => {
            if (node.type !== Type.AREA) {
              return node;
            }
            return {
              ...node,
              size: Math.floor((size * node.grow) / total),
              grow: grow * node.grow,
            };
          })
        );
      }
      // @ts-ignore
      if (b.grow) {
        // @ts-ignore
        return a.concat({ ...b, grow: b.grow * total });
      }
      return a.concat(b);
    }, []),
  };
}

function newNodeGrid(
  node: NodeArea,
  column: number,
  area: number[],
  newId: () => number
): NodeGrid {
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
  return {
    ...node,
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
        id: newId(),
        type: Type.AREA,
        grow: 0,
        size: 0,
      })),
  };
}
