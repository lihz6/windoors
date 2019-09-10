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
  offset: number;
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
  squared: number;
  start: number;
  end: number;
  area: number[];
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
  const lock = children.find(({ type }) => type === Type.LOCK) as NodeLock;
  const square = (width - height) * (width + height);
  return Math.ceil(width - Math.sqrt(square)) + lock.offset;
}

export function findNode(root: Node, childId: number): Node[] {
  const { id, children = [] } = root as NodeTree;
  if (id === childId) return [root];
  for (const node of children) {
    const list = findNode(node, childId);
    if (list.length) {
      return list.concat(root);
    }
  }
  return [];
}

export function containNode(root: Node, childId: number): boolean {
  const { id, children = [] } = root as NodeTree;
  return id === childId || children.some(node => containNode(node, childId));
}
