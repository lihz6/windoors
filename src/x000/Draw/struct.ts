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

interface Pipe {
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
interface Bone {
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
  type: Type.MAIN;
  flow: Flow.L2R;
  width: number;
  height: number;
  children: Node[];
};

type NodeLock = {
  id: number;
  type: Type.LOCK;
  // no children
};

type NodeFlex = {
  id: number;
  type: Type.FLEX;
  flow: Flow;
  size: number;
  grow: number;
  children: Node[];
};

type NodeGrid = {
  id: number;
  type: Type.GRID;
  size: number;
  grow: number;
  column: number;
  area: number[];
  template: number[];
  children: Node[];
};

type NodeArea = {
  id: number;
  type: Type.AREA;
  size: number;
  grow: number;
  // no children
};

type NodePipe = {
  id: number;
  type: Type.PIPE;
  pipe: Pipe;
  // no children
};

type NodeBone = {
  id: number;
  type: Type.BONE;
  bone: Bone;
  // no children
};

// children
export type NodeTree = NodeMain | NodeGrid | NodeFlex;
// no children
export type NodeLeaf = NodeLock | NodeArea | NodePipe | NodeBone;

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
  return Math.ceil(width - Math.sqrt(square));
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

export function frameNode(pathup: NodeTree[]): Node {
  if (
    // NOTE: > 2 not 1, last position is NodeMain
    pathup.length > 2 &&
    pathup[1].type === Type.FLEX &&
    pathup[1].children.reduce(
      (b, n) => b && (n.type === Type.PIPE || n.id == pathup[0].id),
      true
    )
  ) {
    return frameNode(pathup.slice(1));
  }
  return pathup[0];
}
