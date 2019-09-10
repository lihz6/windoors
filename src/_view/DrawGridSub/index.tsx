/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/9/2019, 3:18:34 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, {
  ReactNode,
  ReactEventHandler,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
// import { Link } from 'react-router-dom';
// import { Icon } from 'antd';
import chunk from 'lodash/chunk';
import zip from 'lodash/zip';
// import { tree } from '_util';

import DrawGrid, { inSquared } from '../DrawGrid';

import './style.scss';

export interface DrawGridSubProps {
  setArea: DrawGrid['setState'];
  startrc: [number, number];
  endrc: [number, number];
  area: number[];
  children: ReactNode;
}

export default function DrawGridSub({
  setArea,
  startrc,
  endrc,
  area,
  children,
}: DrawGridSubProps) {
  const [start, setStart] = useState(-1);
  const col = endrc[1] - startrc[1] + 1;
  // const [row, col] = zip(endrc, startrc).map(([e, s]) => e! - s! + 1);
  // const [area, setArea] = useState(
  //   Array.from({ length: row * col }).map((_, index) => index)
  // );
  useEffect(() => {
    const onMouseUp = () => {
      setStart(-1);
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);
  return (
    <div
      className="draw-grid-sub-main"
      style={{
        gridColumnStart: startrc[1] + 1,
        gridRowStart: startrc[0] + 1,
        gridColumnEnd: endrc[1] + 2,
        gridRowEnd: endrc[0] + 2,
        gridTemplateAreas: chunk(area, col)
          .map(row => `"${row.map(a => `a${a}`).join(' ')}"`)
          .join(' '),
      }}>
      {area
        .filter((a, i) => a === i)
        .map(a => (
          <div
            key={a}
            className="draw-grid-sub-item"
            style={{ gridArea: `a${a}` }}
            onMouseEnter={() => {
              // Step 2
              if (start > -1 && area.every((_a, i) => _a === i || _a !== a)) {
                setArea(({ area }) => ({
                  area: area.map((_a, i) =>
                    inSquared(i, start, a, col) ? start : _a
                  ),
                }));
              }
            }}
            onMouseDown={() => {
              // Step 1
              if (area.every((_a, i) => _a === i || _a !== a)) {
                setStart(a);
              }
            }}
            onDoubleClick={() => {
              setArea(({ area }) => ({
                area: area.map((_a, index) => (_a === a ? index : _a)),
              }));
            }}
          />
        ))}
      {children}
    </div>
  );
}
