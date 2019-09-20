/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/16/2019, 10:06:59 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { Dispatch, SetStateAction } from 'react';
// import { Link } from 'react-router-dom';
// import { Icon } from 'antd';
// import chunk from 'lodash/chunk';
import { tree } from '_util';
import DrawGrid, { DrawGridProps } from '../DrawGrid';
import { Node, NodeMain } from '_type/struct';
import useDrawGrid from './useDrawGrid';
import borderData from './borderData';
import useBorder from './useBorder';
import './style.scss';
export interface DrawGridBoxProps
  extends Omit<DrawGridProps, 'disabled' | 'onDone'> {
  setMainNode: Dispatch<SetStateAction<NodeMain>>;
  newNodeId(): number;
  focusNode: Node[];
  innerNode: Node[];
}

export type Border = 'top' | 'right' | 'bottom' | 'left';
export const BORDERS: Border[] = ['top', 'right', 'bottom', 'left'];

export default function DrawGridBox({
  setMainNode,
  newNodeId,
  focusNode,
  innerNode,
  ...props
}: DrawGridBoxProps) {
  const [disabled, onDone] = useDrawGrid(setMainNode, innerNode, newNodeId);
  const borderdata = borderData(focusNode, innerNode);
  const [borderless, onBorderClick] = useBorder(
    setMainNode,
    focusNode,
    innerNode,
    newNodeId
  );
  return (
    <div
      className={tree({
        'draw-grid-box-main': { borderless },
      })}>
      {BORDERS.map(border => (
        <div
          key={border}
          className={tree({
            'draw-grid-box-border': { enabled: !!borderdata[border] },
          })}
          style={{ gridArea: border }}
          onClick={() => onBorderClick(border, borderdata[border])}
        />
      ))}
      <DrawGrid {...props} onDone={onDone} disabled={disabled} />
    </div>
  );
}
