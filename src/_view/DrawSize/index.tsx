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
import { NodeTree, NodeArea, Type, Flow } from '../../x000/Draw/struct';
import { divmod } from '_util';

export interface DrawSizeProps {
  focusNode: [NodeArea, ...NodeTree[]];
}

export default function DrawSize({ focusNode: [node, parent] }: DrawSizeProps) {
  const [{ size, grow }, setGrowSize] = useState({
    size: node.size,
    grow: node.grow,
  });
  const [template, _setTemplate] = useState<number[]>(parent['template'] || []);
  const setTemplate = (value, index) => {
    _setTemplate(template.map((v, i) => (i === index ? value : v)));
  };
  const onClick = () => {
    console.log('Okay');
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
            if (b.id === node.id) {
              return a;
            }
            return a + (b['grow'] || 0);
          }, grow || 0)}
          size={size}
          grow={grow}
        />
        <div className="draw-size-item">
          <div>　　</div>
          <Button
            onClick={onClick}
            size="small"
            type="primary"
            disabled={
              size < 0 ||
              grow < 0 ||
              size + grow <= 0 ||
              (size === node.size && grow === node.grow)
            }>
            确定
          </Button>
        </div>
      </React.Fragment>
    );
  }
  const { column, area, children } = parent;
  const index = children.findIndex(({ id }) => id === node.id);
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
        ([[grow, growIndex], [size, sizeIndex]]) => (
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
      {chunk(temp.slice(rs, re), 2).map(
        ([[grow, growIndex], [size, sizeIndex]]) => (
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
          onClick={onClick}
          size="small"
          type="primary"
          disabled={isEqual(parent.template, template)}>
          确定
        </Button>
      </div>
    </React.Fragment>
  );
}

function Item({ label, size, grow, base = 1, onSizeChange, onGrowChange }) {
  const basement = `${base || 1}`;
  return (
    <div className="draw-size-item">
      <div>{label}</div>
      <InputNumber
        value={grow}
        size="small"
        onChange={value => {
          onGrowChange(value);
        }}
      />
      <div title={basement}>&nbsp;/&nbsp;{basement}&nbsp;+&nbsp;</div>
      <InputNumber
        size="small"
        value={size}
        onChange={value => {
          onSizeChange(value);
        }}
      />
      <div>&nbsp;mm</div>
    </div>
  );
}
