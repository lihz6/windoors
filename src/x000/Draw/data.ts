import { NodeMain, Type, Flow, Pipe } from './struct';
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
                      type: Type.AREA,
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
                      type: Type.AREA,
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
                      type: Type.AREA,
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
                  type: Type.AREA,
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
                  type: Type.AREA,
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
