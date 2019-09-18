/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/16/2019, 10:06:59 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { ReactNode, ReactEventHandler } from 'react';
// import { Link } from 'react-router-dom';
// import { Icon } from 'antd';
// import chunk from 'lodash/chunk';
import { tree } from '_util';
import DrawGrid, { DrawGridProps } from '../DrawGrid';
import './style.scss';
import { Node, Type, Flow } from '../../x000/Draw/struct';
export type Border = 'top' | 'right' | 'bottom' | 'left';
export interface DrawGridBoxProps extends DrawGridProps {
  onBorderClick(border: Border, node: Node | undefined): void;
  focusNode: Node[];
  innerNode: Node[];
}

export default function DrawGridBox({
  onBorderClick,
  focusNode,
  innerNode,
  ...props
}: DrawGridBoxProps) {
  const borderless = focusNode.length < 2 || focusNode[1].type === Type.FLEX;
  const borderdata = borderData(focusNode, innerNode);
  const borders: Border[] = ['top', 'right', 'bottom', 'left'];
  return (
    <div
      className={tree({
        'draw-grid-box-main': { borderless },
      })}>
      {borders.map(border => (
        <div
          key={border}
          className={tree({
            'draw-grid-box-border': { enabled: !!borderdata[border] },
          })}
          style={{ gridArea: border }}
          onClick={() =>
            borderless || onBorderClick(border, borderdata[border])
          }
        />
      ))}
      <DrawGrid {...props} />
    </div>
  );
}

function borderData(focusNode: Node[], innerNode: Node[]) {
  if (focusNode.length >= innerNode.length) {
    return {};
  }
  const key = (flow: Flow, index: 0 | -1) => {
    if (flow === Flow.T2B) {
      return (index && 'bottom') || 'top';
    }
    return (index && 'right') || 'left';
  };
  return (
    innerNode
      .slice(0, 1 - focusNode.length)
      // .reverse()
      .reduce((a, b) => {
        if (b.type === Type.FLEX) {
          const { flow, children } = b;
          if (children[0].type === Type.PIPE) {
            a[key(flow, 0)] = children[0];
          }
          if (children.slice(-1)[0].type === Type.PIPE) {
            a[key(flow, -1)] = children.slice(-1)[0];
          }
        }
        return a;
      }, {})
  );
}
