/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/6/2019, 2:34:13 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { ReactNode, ReactEventHandler, SyntheticEvent } from 'react';
// import { Link } from 'react-router-dom';
// import { Icon } from 'antd';
// import chunk from 'lodash/chunk';
import { tree, gridTemplateAreas, gridTemplateStyle } from '_util';
import { NodeMain, Node, lockwidth, Type } from '_type/struct';

import './style.scss';

export interface DrawNodeProps {
  mainNode: NodeMain;
  focusId: number;
  scale: number;
  offset: [number, number];
  onClick(node: Node): void;
}

// TODO: https://github.com/clauderic/react-sortable-hoc
export default function DrawNode({
  mainNode,
  offset: [x, y],
  scale,
  focusId,
  onClick,
}: DrawNodeProps) {
  return (
    <div
      className={tree({ 'draw-node': mainNode.type })}
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale / 100})`,
        width: `${mainNode.width}px`,
        height: `${mainNode.height}px`,
        flexDirection: mainNode.flow,
        border: `${(1 * 100) / scale}px solid #eee`,
      }}>
      {mainNode.children.map(child =>
        render(child, mainNode, focusId, onClick)
      )}
    </div>
  );
}

function render(
  node: Node,
  parent: Node,
  focusId: number,
  onClick: DrawNodeProps['onClick']
) {
  const props = {
    key: node.id,
    className: tree({
      'draw-node': { focus: node.id === focusId, [node.type]: true },
    }),
  };
  const onNodeClick: ReactEventHandler = event => {
    event.stopPropagation();
    onClick(node);
  };
  switch (node.type) {
    // case Type.MAIN: see DrawNode
    case Type.LOCK:
      return (
        <div
          {...props}
          style={{
            flex: `0 0 ${lockwidth(parent as NodeMain)}px`,
            // flex: `0 0 0.5%`,
            background: 'yellow',
          }}
        />
      );
    case Type.GRID:
      return (
        <div
          {...props}
          style={{
            display: 'grid',
            flex: `${node.grow} ${node.grow} ${node.size}px`,
            gridTemplateAreas: gridTemplateAreas(node.area, node.column),
            ...gridTemplateStyle(node.template, node.column),
          }}>
          {node.children.map(child => render(child, node, focusId, onClick))}
        </div>
      );
    case Type.FLEX:
      return (
        <div
          {...props}
          onClick={onNodeClick}
          style={{
            display: 'flex',
            flexDirection: node.flow,
            flex: `${node.grow} ${node.grow} ${node.size}px`,
          }}>
          {node.children.map(child => render(child, node, focusId, onClick))}
        </div>
      );
    case Type.AREA:
      return (
        <div
          {...props}
          onClick={onNodeClick}
          style={{
            flex: `${node.grow} ${node.grow} ${node.size}px`,
          }}
        />
      );
    case Type.PIPE:
      const size = Math.ceil(node.pipe.width / 10);
      return (
        <div
          {...props}
          onClick={onNodeClick}
          style={{
            flex: `0 0 ${node.pipe.width}px`,
            // background: 'linear-gradient(45deg, #777, #aaa, #777)',
            background: '#777',
            boxShadow: `inset ${size}px 0 ${size}px #aaa`,
          }}
        />
      );
    case Type.BONE:
      return (
        <div
          {...props}
          onClick={onNodeClick}
          style={{
            width: `${node.bone.width}px`,
            height: `${node.bone.height}px`,
            backgroundImage: `url(${node.bone.url})`,
          }}
        />
      );
  }
}
