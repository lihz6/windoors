/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/19/2019, 11:17:59 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { ReactNode, ReactEventHandler, useState } from 'react';
// import { Link } from 'react-router-dom';
import { InputNumber, Button } from 'antd';
import lastIndexOf from 'lodash/lastIndexOf';
import indexOf from 'lodash/indexOf';
import isEqual from 'lodash/isEqual';
import chunk from 'lodash/chunk';

// import { tree } from '_util';

import './style.scss';
import {
  NodeTree,
  NodeArea,
  Flow,
  NodeGrid,
  NodeFlex,
  Type,
} from '_type/struct';
import { divmod } from '_util';

export interface DrawSizeProps {
  onSubmit(
    node: NodeGrid | NodeArea | NodeFlex,
    data: Pick<NodeGrid, 'template'> | Pick<NodeArea, 'grow' | 'size'>
  ): void;
  focusNode: [NodeArea, ...NodeTree[]];
}

export default function DrawSize({
  focusNode: [current, parent],
  onSubmit,
}: DrawSizeProps) {
  const [{ size, grow }, setGrowSize] = useState({
    size: current.size,
    grow: current.grow,
  });
  const [template, _setTemplate] = useState<number[]>(parent['template'] || []);
  const setTemplate = (value, index) => {
    _setTemplate(template.map((v, i) => (i === index ? value : v)));
  };
  if (parent.type === Type.FLEX || parent.type === Type.MAIN) {
    const lables = { [Flow.L2R]: '宽：', [Flow.T2B]: '高：' };
    return (
      <React.Fragment>
        <Item
          label={lables[parent.flow]}
          onGrowChange={grow => setGrowSize({ grow, size })}
          onSizeChange={size => setGrowSize({ grow, size })}
          base={parent.children.reduce((a, b) => {
            if (b.id === current.id) {
              return a;
            }
            return a + (b['grow'] || 0);
          }, grow)}
          size={size}
          grow={grow}
        />
        <div className="draw-size-item">
          <div>　　</div>
          <Button
            onClick={() => {
              onSubmit(current, { grow, size });
            }}
            size="small"
            type="primary"
            disabled={
              size < 0 ||
              grow < 0 ||
              size + grow <= 0 ||
              (size === current.size && grow === current.grow)
            }>
            确定
          </Button>
        </div>
      </React.Fragment>
    );
  }
  const { column, area, children } = parent;
  const index = children.findIndex(({ id }) => id === current.id);
  const [rs, cs] = divmod(indexOf(area, index), column);
  const [re, ce] = divmod(lastIndexOf(area, index), column, 1);
  const temp = template.map((value, index) => [value, index]);
  const colBase = template
    .slice(0, column)
    .map((v, i) => (i + 1) % 2 && v)
    .reduce((a, b) => a + b, 0);
  const rowBase = template
    .slice(column)
    .map((v, i) => (i + 1) % 2 && v)
    .reduce((a, b) => a + b, 0);
  return (
    <React.Fragment>
      {chunk(temp.slice(cs, ce), 2).map(
        ([[grow, growIndex], [size, sizeIndex]]) =>
          size < 0 ? null : (
            <Item
              key={growIndex}
              onGrowChange={grow => setTemplate(grow, growIndex)}
              onSizeChange={size => setTemplate(size, sizeIndex)}
              label="宽："
              base={colBase}
              size={size}
              grow={grow}
            />
          )
      )}
      {chunk(temp.slice(column + rs, column + re), 2).map(
        ([[grow, growIndex], [size, sizeIndex]]) =>
          size < 0 ? null : (
            <Item
              key={growIndex}
              onGrowChange={grow => setTemplate(grow, growIndex)}
              onSizeChange={size => setTemplate(size, sizeIndex)}
              label="高："
              base={rowBase}
              size={size}
              grow={grow}
            />
          )
      )}
      <div className="draw-size-item">
        <div>　　</div>
        <Button
          onClick={() => {
            onSubmit(parent, { template });
          }}
          size="small"
          type="primary"
          disabled={isEqual(parent.template, template)}>
          确定
        </Button>
      </div>
    </React.Fragment>
  );
}

function Item({ label, size, grow, base, onSizeChange, onGrowChange }) {
  const basement = `${base || 1}`;
  return (
    <div className="draw-size-item">
      <div>{label}</div>
      <InputNumber
        value={grow}
        size="small"
        disabled={base <= grow}
        onChange={value => {
          onGrowChange(value || 0);
        }}
      />
      <div title={basement}>&nbsp;/&nbsp;{basement}&nbsp;+&nbsp;</div>
      <InputNumber
        size="small"
        value={size}
        onChange={value => {
          onSizeChange(value || 0);
        }}
      />
      <div>&nbsp;mm</div>
    </div>
  );
}
