/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/18/2019, 8:28:33 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, {
  useState,
  ReactNode,
  ReactEventHandler,
  SetStateAction,
  Dispatch,
} from 'react';
// import { Link } from 'react-router-dom';
import { Input, InputNumber, Button } from 'antd';
// import chunk from 'lodash/chunk';
// import { tree } from '_util';

import './style.scss';

export interface DrawBaseProps {
  onSubmit?({ width, height, title }): void;
  size?: 'large' | 'small' | 'default';
  width?: number;
  height?: number;
  title?: string;
}

export default function DrawBase({
  onSubmit,
  size = 'default',
  width: w = 0,
  height: h = 0,
  title: t = '',
}: DrawBaseProps) {
  const [title, setTitle] = useState(t);
  const [height, setHeight] = useState(h);
  const [width, setWidth] = useState(w);
  const onClick = () => {
    if (width > 0 && height > 0 && title && onSubmit) {
      onSubmit({ width, height, title });
    }
  };
  return (
    <div className="draw-base-main">
      <div className="draw-base-item">
        <div>名称：</div>
        <Input
          onChange={({ target: { value } }) => setTitle(value)}
          value={title}
          size={size}
        />
      </div>
      <div className="draw-base-item">
        <div>　宽：</div>
        <InputNumber
          onChange={value => setWidth(value!)}
          value={width}
          size={size}
          //
        />
        <div>　高：</div>
        <InputNumber
          onChange={value => setHeight(value!)}
          value={height}
          size={size}
          //
        />
      </div>
      <div className="draw-base-item">
        <div>　　　</div>
        <Button onClick={onClick} size={size}>
          确定
        </Button>
      </div>
    </div>
  );
}
