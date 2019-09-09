/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/6/2019, 5:31:08 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, {
  ReactNode,
  ReactEventHandler,
  useState,
  useEffect,
} from 'react';
// import { Link } from 'react-router-dom';
// import { Icon } from 'antd';
// import chunk from 'lodash/chunk';
import zip from 'lodash/zip';
import { tree, divmod } from '_util';
import DrawGridSub from '../DrawGridSub';
import './style.scss';

export interface DrawGridProps {
  squared: number;
}

export default function DrawGrid({ squared }: DrawGridProps) {
  const [ondown, setOndown] = useState(false);
  const [start, setStart] = useState(-1);
  const [area, setArea] = useState([0]);
  const [end, setEnd] = useState(-1);
  useEffect(() => {
    // Step 3
    const onMouseUp = () => {
      setOndown(false);
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);
  const isSelected = (idx: number) => {
    const min = start;
    const max = end;
    return (
      idx >= min &&
      idx <= max &&
      idx % squared >= min % squared &&
      idx % squared <= max % squared
    );
  };
  const children = (): [React.ReactChild | null, number[]] => {
    if (start < 0 || end < 0 || ondown) {
      const indices = Array.from({ length: squared * squared }).map(
        (_, index) => index
      );
      return [null, indices];
    }
    const erc = divmod(end, squared);
    const src = divmod(start, squared);
    const [row, col] = zip(erc, src).map(([e, s]) => e! - s! + 1);
    const elem = (
      <DrawGridSub startrc={src} endrc={erc} area={area} setArea={setArea}>
        <div
          className="draw-grid-move"
          onMouseDown={() => {
            setOndown(true);
          }}
        />
      </DrawGridSub>
    );
    const indices = Array.from({ length: squared * squared - row * col }).map(
      (_, index) => {
        if (index < start) return index;
        const floor = Math.floor((index - start) / (squared - col));
        return index + Math.min(floor + 1, row) * col;
      }
    );
    return [elem, indices];
  };
  const [row, col] = children();
  return (
    <div
      className="draw-grid-main"
      style={{
        gridTemplateColumns: `repeat(${squared}, 1fr)`,
        gridTemplateRows: `repeat(${squared}, 1fr)`,
      }}>
      {row}
      {col.map(index => (
        <div
          key={index + 1}
          className={tree({
            'draw-grid-item': { selected: isSelected(index) },
          })}
          onMouseEnter={() => {
            // Step 2
            if (
              ondown &&
              zip(divmod(index, squared), divmod(start, squared)).every(
                ([e, s]) => e! >= s!
              )
            ) {
              setEnd(index);
              const erc = divmod(index, squared);
              const src = divmod(start, squared);
              const [row, col] = zip(erc, src).map(([e, s]) => e! - s! + 1);
              setArea(
                Array.from({ length: row * col }).map((_, index) => index)
              );
            }
          }}
          onMouseDown={() => {
            // Step 1
            setOndown(true);
            setStart(index);
            setEnd(index);
          }}
        />
      ))}
    </div>
  );
}
export function inSquared(
  idx: number,
  start: number,
  end: number,
  squared: number
) {
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  return (
    idx >= min &&
    idx <= max &&
    idx % squared >= min % squared &&
    idx % squared <= max % squared
  );
}
export function what(start: number, end: number, cell: number) {
  if (start % cell === end % cell) {
    return 'column';
  }
  if (Math.floor(start / cell) === Math.floor(end / cell)) {
    return 'row';
  }
  return 'grid';
}
