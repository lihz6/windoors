import lastIndexOf from 'lodash/lastIndexOf';
import indexOf from 'lodash/indexOf';
import { divmod, allocsize } from '_util';
export enum Type {
  MAIN = 'main', // 门框
  LOCK = 'lock', // 门隙
  FLEX = 'flex', // 伸缩
  GRID = 'grid', // 网格
  AREA = 'area', // 空白
  PIPE = 'pipe', // 钢管
  BONE = 'bone', // 花纹
}

export enum Flow {
  T2B = 'column',
  L2R = 'row',
}

export interface Pipe {
  id: string;
  width: number;
  height: number;
  color: string;
}

export const Pipe: Record<'W5H5' | 'W3H3', Pipe> = {
  W5H5: {
    id: 'W5H5',
    width: 50,
    height: 50,
    color: 'gray',
  },
  W3H3: {
    id: 'W3H3',
    width: 30,
    height: 30,
    color: 'gray',
  },
};

export interface Bone {
  id: string;
  width: number;
  height: number;
  url: string;
}

export const Bone: Record<'CUTTING', Bone> = {
  CUTTING: {
    id: 'CUTTING',
    width: 240,
    height: 480,
    url: '',
  },
};

export type NodeMain = {
  id: number;
  title: string;
  author: string;
  version: number;
  type: Type.MAIN;
  flow: Flow;
  width: number;
  height: number;
  children: Node[];
};

export type NodeLock = {
  id: number;
  type: Type.LOCK;
  // no children
};

export type NodeFlex = {
  id: number;
  type: Type.FLEX;
  flow: Flow;
  size: number;
  grow: number;
  children: Node[];
};

export type NodeGrid = {
  id: number;
  type: Type.GRID;
  size: number;
  grow: number;
  column: number;
  area: number[];
  template: number[];
  children: Node[];
};

export type NodeArea = {
  id: number;
  type: Type.AREA;
  size: number;
  grow: number;
  // no children
};

export type NodePipe = {
  id: number;
  type: Type.PIPE;
  pipe: Pipe;
  // no children
};

export type NodeBone = {
  id: number;
  type: Type.BONE;
  bone: Bone;
  size: number;
  grow: number;
  // no children
};

// children
export type NodeTree = NodeMain | NodeGrid | NodeFlex;
// no children
export type NodeLeaf = NodeLock | NodeArea | NodePipe | NodeBone;
// .grow .size
export type NodeGrow = NodeArea | NodeFlex | NodeGrid | NodeBone;
export type Node = NodeTree | NodeLeaf;

export function lockwidth(root: NodeMain) {
  const barheight = (nodes: Node[]): number => {
    return nodes.reduce((a, node) => {
      const { children, pipe } = node as NodeFlex & NodePipe;
      if (children && children.length > 0) {
        return Math.max(a, barheight(children));
      } else if (pipe && pipe.height > 0) {
        return Math.max(a, pipe.height);
      } else {
        return a;
      }
    }, 0);
  };
  const { width, children } = root;
  const height = barheight(children);
  const square = (width - height) * (width + height);
  const result = width - Math.sqrt(square);
  // NOTE: 0 | 01 | 10 | 010
  return Math.ceil(result * (children.length - 1));
}

export function calcNodeSizing(root: NodeMain) {
  const sizing: { [key: number]: { width: number; height: number } } = {
    [root.id]: {
      width: root.width,
      height: root.height,
    },
  };
  const tree = (parent: NodeTree, children: Node[]) => {
    if (parent.type === Type.GRID) {
      // TODO
      const sizeTemplate = (
        parentSize: number,
        template: number[]
      ): number[] => {
        const [growTotal, sizeTotal] = template.reduce(
          ([growTotal, sizeTotal], a, index) => {
            if (index % 2) {
              return [growTotal, sizeTotal + Math.abs(a)];
            } else {
              return [growTotal + a, sizeTotal];
            }
          },
          [0, 0]
        );
        const growSize = allocsize(parentSize - sizeTotal, growTotal);
        return template.map((a, index) => {
          if (index % 2) {
            return Math.abs(a);
          } else {
            return growSize(a);
          }
        });
      };
      // to be continue
      const { column, template, area, children } = parent;
      const colTemplate = sizeTemplate(
        sizing[parent.id].width,
        template.slice(0, column)
      );
      const rowTemplate = sizeTemplate(
        sizing[parent.id].height,
        template.slice(column)
      );
      children.forEach((node, index) => {
        const first = indexOf(area, index);
        const last = lastIndexOf(area, index);
        const [rs, cs] = divmod(first, column);
        const [re, ce] = divmod(last, column, 1);
        sizing[node.id] = {
          width: colTemplate.slice(cs, ce).reduce((a, b) => a + b, 0),
          height: rowTemplate.slice(rs, re).reduce((a, b) => a + b, 0),
        };
        if (node.type === Type.FLEX || node.type === Type.GRID) {
          tree(node, node.children);
        }
      });
    } else {
      const flexSizing = ({ id, flow }: typeof parent, size: number) => {
        if (flow === Flow.L2R) {
          return {
            width: size,
            height: sizing[id].height,
          };
        } else {
          return {
            width: sizing[id].width,
            height: size,
          };
        }
      };
      const [sizeTotal, growTotal, growable] = children.reduce(
        ([sizeTotal, growTotal, growable], child) => {
          if (child.type === Type.LOCK) {
            const size = lockwidth(parent as NodeMain);
            sizing[child.id] = flexSizing(parent, size);
            return [sizeTotal + size, growTotal, growable];
          } else if (child.type === Type.PIPE) {
            const size = child.pipe.width;
            sizing[child.id] = flexSizing(parent, size);
            return [sizeTotal + size, growTotal, growable];
          } else if (child.type === Type.MAIN) {
            throw `Only one '${Type.MAIN}' one tree`;
          } else {
            const { grow, size } = child;
            return [
              sizeTotal + Math.abs(size),
              growTotal + grow,
              growable.concat(child),
            ];
          }
        },
        [0, 0, [] as NodeGrow[]]
      );
      const parentSize =
        sizing[parent.id][
          { [Flow.L2R]: 'width', [Flow.T2B]: 'height' }[parent.flow]
        ];
      const growSize = allocsize(parentSize - sizeTotal, growTotal);
      growable.forEach(node => {
        const { size, grow } = node;
        sizing[node.id] = flexSizing(parent, Math.abs(size) + growSize(grow));
        if (node.type !== Type.AREA && node.type !== Type.BONE) {
          tree(node, node.children);
        }
      });
    }
  };
  tree(root, root.children);
  return sizing;
}

export function findNode(root: Node, childId: number): [Node, ...NodeTree[]] {
  const { id, children = [] } = root as NodeTree;
  if (id === childId) return [root];
  for (const node of children) {
    const uplist = findNode(node, childId);
    if (uplist.length) {
      return uplist.concat(root) as any;
    }
  }
  return [] as any;
}

export function containNode(root: Node, childId: number): boolean {
  const { id, children = [] } = root as NodeTree;
  return id === childId || children.some(node => containNode(node, childId));
}

export function frameNode(pathup: NodeTree[]): Node[] {
  if (
    // NOTE: > 2 not 1, last position is NodeMain
    pathup.length > 2 &&
    pathup[1].type === Type.FLEX &&
    pathup[1].children.reduce(
      (b, n) => b && (n.type === Type.PIPE || n.id === pathup[0].id),
      true
    )
  ) {
    return frameNode(pathup.slice(1));
  }
  return pathup;
}

export function treeNode<T extends NodeTree>(
  root: T,
  handle: (node: Node) => Node
): T {
  const newNode = handle(root);
  if (newNode !== root) {
    return newNode as T;
  }
  if (!root.children) return root;
  const [children, changed] = root.children.reduce<[Node[], boolean]>(
    ([children, changed], child) => {
      const newChild = treeNode(child as T, handle);
      children.push(newChild);
      return [children, changed || child !== newChild];
    },
    [[], false]
  );
  return changed ? { ...root, children } : root;
}

export function replaceNode<T extends NodeTree>(
  root: T,
  oldNode: Node,
  newNode: Node
): T {
  return treeNode(root, node => (node.id === oldNode.id ? newNode : node));
}

export function deleteNode<T extends NodeTree>(root: T, deleteId: number): T {
  return treeNode(root, node => {
    if (
      node.type !== Type.FLEX ||
      node.children.every(({ id }) => id !== deleteId)
    ) {
      return node;
    }
    const index = node.children.findIndex(({ id }) => id === deleteId);
    const children = node.children.slice();
    if (children[index].type === Type.PIPE) {
      children.splice(index, 1);
    } else {
      children.splice(index && index - 1, 2);
    }
    switch (children.length) {
      case 1:
        return { ...children[0], size: node.size, grow: node.grow };
      case 0:
        throw 'Not Implemented';
      default:
        return {
          ...node,
          children,
        };
    }
  });
}

export function duplicate<T extends Node>(
  root: T,
  newId: (oldId: number) => number
): T {
  const newNode = { ...root, id: newId(root.id) };
  if (root['children']) {
    newNode['children'] = root['children'].map(node => duplicate(node, newId));
  }
  return newNode;
}
