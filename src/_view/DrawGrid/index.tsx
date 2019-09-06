/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/6/2019, 5:31:08 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { ReactNode, ReactEventHandler, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Icon } from 'antd';
// import chunk from 'lodash/chunk';
import { tree } from '_util';

import './style.scss';

export interface DrawGridProps {
  cell: number;
}

export default function DrawGrid({ cell }: DrawGridProps) {
  const [ondown, setOndown] = useState(false);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const isSelected = (idx: number) => {
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    return (
      idx >= min &&
      idx <= max &&
      idx % cell >= min % cell &&
      idx % cell <= max % cell
    );
  };
  return (
    <div
      className="draw-grid-main"
      onMouseLeave={() => {
        if (ondown) {
          setOndown(false);
          setStart(-1);
          setEnd(-1);
        }
      }}>
      {Array.from({ length: cell * cell }).map((_, index) => (
        <div
          key={index}
          className={tree({
            'draw-grid-item': { selected: isSelected(index) },
          })}
          onMouseEnter={() => {
            if (ondown) {
              setEnd(index);
            }
          }}
          onMouseDown={() => {
            setOndown(true);
            setStart(index);
            setEnd(index);
          }}
          onMouseUp={() => {
            setOndown(false);
          }}
        />
      ))}
    </div>
  );
}

function what(start: number, end: number, cell: number) {
  if (start % cell === end % cell) {
    return 'column';
  }
  if (Math.floor(start / cell) === Math.floor(end / cell)) {
    return 'row';
  }
  return 'grid';
}
