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

export interface DrawGridBoxProps extends DrawGridProps {
  onBorderClick(
    border: keyof DrawGridBoxProps['borderdata'],
    hasEnabled: boolean | undefined
  ): void;
  borderless: boolean;
  borderdata: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
}

export default function DrawGridBox({
  onBorderClick,
  borderless,
  borderdata,
  ...props
}: DrawGridBoxProps) {
  const borders: (keyof DrawGridBoxProps['borderdata'])[] = [
    'top',
    'right',
    'bottom',
    'left',
  ];
  return (
    <div
      className={tree({
        'draw-grid-box-main': { borderless },
      })}>
      {borders.map(border => (
        <div
          key={border}
          className={tree({
            'draw-grid-box-border': { enabled: borderdata[border] },
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
