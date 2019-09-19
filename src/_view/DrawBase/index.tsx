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
import { tree } from '_util';

import './style.scss';
import { Flow, Node, Type } from '../../x000/Draw/struct';

export interface DrawBaseProps {
  onSubmit({ width, height, title, flow, position }): void;
  size?: 'large' | 'small' | 'default';
  width?: number;
  height?: number;
  title?: string;
  position?: string;
  flow?: Flow;
}

export default function DrawBase({
  onSubmit,
  size = 'default',
  width: w,
  height: h,
  title: t = '',
  position: p = '',
  flow: f,
}: DrawBaseProps) {
  const [title, setTitle] = useState(t);
  const [height, setHeight] = useState(h);
  const [width, setWidth] = useState(w);
  const [flow, setFlow] = useState(f);
  const [position, setPosition] = useState(p);
  const onClick = () => {
    onSubmit({ width, height, title, flow, position });
  };
  const disabled =
    !width ||
    !height ||
    !title ||
    !position ||
    (title === t &&
      height === h &&
      width === w &&
      position === p &&
      flow === f);
  return (
    <div className="draw-base-main">
      <div className={tree({ 'draw-base-item': size })}>
        <div>名称：</div>
        <Input
          placeholder="请输入名称"
          autoFocus={size !== 'small'}
          onChange={({ target: { value } }) => setTitle(value)}
          value={title}
          size={size}
        />
      </div>
      <div className={tree({ 'draw-base-item': size })}>
        <div>　宽：</div>
        <InputNumber
          onChange={value => setWidth(value!)}
          placeholder="单位：毫米(mm)"
          value={width}
          size={size}
          step={10}
          min={0}
          //
        />
        <div>　高：</div>
        <InputNumber
          onChange={value => setHeight(value!)}
          placeholder="单位：毫米(mm)"
          value={height}
          size={size}
          step={10}
          min={0}
          //
        />
      </div>
      <div className={tree({ 'draw-base-item': size })}>
        <div>开口：</div>
        <DrawBaseOpen
          size={size}
          position={position}
          mainFlow={flow}
          onSelect={(flow, row) => {
            setFlow(flow);
            setPosition(row);
          }}
        />
      </div>
      <div className={tree({ 'draw-base-item': size })}>
        <div>　　　</div>
        <Button
          onClick={onClick}
          size={size}
          type="primary"
          disabled={disabled}>
          确定
        </Button>
      </div>
    </div>
  );
}

function DrawBaseOpen({ size, position, mainFlow, onSelect }) {
  const flows = [Flow.L2R, Flow.T2B];
  const rows = ['10', '01', '010'];
  return (
    <div className="draw-base-open" title="请选择开口位置">
      <div
        onClick={() => onSelect(mainFlow || Flow.L2R, '0')}
        className={tree({
          'draw-base-box': [size, { enabled: position === '0' }],
        })}
      />
      {flows.map(flow => (
        <React.Fragment key={flow}>
          {rows.map(row => (
            <div
              key={row}
              onClick={() => onSelect(flow, row)}
              className={tree({
                'draw-base-box': [
                  size,
                  {
                    enabled: flow === mainFlow && row === position,
                  },
                ],
              })}
              style={{ flexDirection: flow }}>
              {row.split('').map(r => (
                <div key={r} className={`draw-base-box-${r}`} />
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
