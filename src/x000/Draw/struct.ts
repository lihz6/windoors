export enum Type {
  MAIN = 'main', // 门框
  LOCK = 'lock', // 门隙
  FLEX = 'flex', // 格子
  PIPE = 'pipe', // 钢管
  BONE = 'bone', // 花纹
}

enum Flow {
  T2B = 'column',
  L2R = 'row',
}

interface Pipe {
  id: string;
  width: number;
  height: number;
  color: string;
}

const Pipe: Record<'W5H5' | 'W3H3', Pipe> = {
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

const Bone: Record<'CUTTING', Bone> = {
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

type NodeLock = { id: number; type: Type.LOCK; offset: number };

type NodeArea = {
  id: number;
  type: Type.FLEX;
  flow?: Flow;
  size: number;
  grow: number;
  children?: Node[];
};

type NodePipe = { id: number; type: Type.PIPE; pipe: Pipe };

type NodeBone = { id: number; type: Type.BONE; bone: Bone };

export type Node = NodeMain | NodeLock | NodeArea | NodePipe | NodeBone;

const now = Date.now();

export const data: NodeMain = {
  id: now,
  type: Type.MAIN,
  flow: Flow.L2R,
  width: 1800,
  height: 2400,
  children: [
    { id: now + 1, type: Type.LOCK, offset: 0 },
    {
      id: now + 2,
      type: Type.FLEX,
      flow: Flow.T2B,
      size: 0,
      grow: 1,
      children: [
        {
          id: now + 3,
          type: Type.PIPE,
          pipe: Pipe.W5H5,
        },
        {
          id: now + 4,
          type: Type.FLEX,
          flow: Flow.L2R,
          size: 0,
          grow: 1,
          children: [
            {
              id: now + 6,
              type: Type.PIPE,
              pipe: Pipe.W5H5,
            },
            {
              id: now + 7,
              type: Type.FLEX,
              size: 0,
              grow: 1,
              flow: Flow.T2B,
              children: [
                {
                  id: now + 9,
                  type: Type.FLEX,
                  size: 0,
                  grow: 2,
                  flow: Flow.L2R,
                  children: [
                    {
                      id: now + 14,
                      type: Type.FLEX,
                      size: 0,
                      grow: 1,
                    },
                    {
                      id: now + 15,
                      type: Type.PIPE,
                      pipe: Pipe.W5H5,
                    },
                    {
                      id: now + 16,
                      type: Type.FLEX,
                      size: 0,
                      grow: 1,
                    },
                    {
                      id: now + 17,
                      type: Type.PIPE,
                      pipe: Pipe.W5H5,
                    },
                    {
                      id: now + 18,
                      type: Type.FLEX,
                      size: 0,
                      grow: 1,
                    },
                  ],
                },
                {
                  id: now + 10,
                  type: Type.PIPE,
                  pipe: Pipe.W5H5,
                },
                {
                  id: now + 11,
                  type: Type.FLEX,
                  size: 0,
                  grow: 1,
                },
                {
                  id: now + 12,
                  type: Type.PIPE,
                  pipe: Pipe.W5H5,
                },
                {
                  id: now + 13,
                  type: Type.FLEX,
                  size: 0,
                  grow: 2,
                },
              ],
            },
            {
              id: now + 8,
              type: Type.PIPE,
              pipe: Pipe.W5H5,
            },
          ],
        },
        {
          id: now + 5,
          type: Type.PIPE,
          pipe: Pipe.W5H5,
        },
      ],
    },
  ],
};

export function lockwidth(data: NodeMain) {
  const barheight = (nodes: Node[]): number => {
    return nodes.reduce((a, node) => {
      const { children, pipe } = node as NodeArea & NodePipe;
      if (children && children.length > 0) {
        return Math.max(a, barheight(children));
      } else if (pipe && pipe.height > 0) {
        return Math.max(a, pipe.height);
      } else {
        return a;
      }
    }, 0);
  };
  const { width, children } = data;
  const height = barheight(children);
  const lock = children.find(({ type }) => type == Type.LOCK) as NodeLock;
  const square = (width - height) * (width + height);
  return Math.ceil(width - Math.sqrt(square)) + lock.offset;
}

export function listPath(node: NodeMain, id: number): Node[] {
  if (node.id === id) return [node];
  for (const n of node.children || []) {
    const path = listPath(n as NodeMain, id);
    if (path.length) {
      return [...path, node];
    }
  }
  return [];
}

export function nodeContains(
  main: NodeMain,
  childId: number,
  includeSelf = true
) {
  if (includeSelf && main.id === childId) return true;
  const contains = (parent: NodeMain) => {
    for (const child of parent.children || []) {
      if (child.id === childId || contains(child as NodeMain)) {
        return true;
      }
    }
    return false;
  };
  return contains(main);
}
