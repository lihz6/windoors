/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/6/2019, 2:11:17 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { ReactEventHandler } from 'react';
// import { Link } from 'react-router-dom';
import { Icon, Slider } from 'antd';
// import chunk from 'lodash/chunk';
// import { tree } from '_util';

import './style.scss';

export interface DrawScaleProps {
  setMinScale: ReactEventHandler;
  setMaxScale: ReactEventHandler;
  setScale(scale: number): void;
  minScale: number;
  maxScale: number;
  scale: number;
}

export default function DrawScale({
  setMinScale,
  setMaxScale,
  setScale,
  minScale,
  maxScale,
  scale,
}: DrawScaleProps) {
  return (
    <div className="draw-scale-main">
      <Icon
        type="minus-circle"
        className="draw-scale-min"
        onClick={setMinScale}
      />
      <Slider
        className="draw-scale-slider"
        min={minScale}
        max={maxScale}
        tipFormatter={value => `${value}%`}
        onChange={scale => setScale(scale as number)}
        value={scale}
      />
      <Icon
        type="plus-circle"
        className="draw-scale-max"
        onClick={setMaxScale}
      />
    </div>
  );
}
