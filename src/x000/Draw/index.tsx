/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/5/2019, 7:41:10 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Icon, Slider, Collapse } from 'antd';
import withPath from '_base/withPath';
//import Component from '_view/Component';
import { data, NodeRoot, Node, Type } from './struct';

import { getData } from './fetch';
import './style.scss';

export default withPath('/x000/draw', {}, {})(
  ({ history, match: { params } }) => {
    const canvas = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [root, setRoot] = useState<NodeRoot>(data);
    const [offset, setOffset] = useState<[number, number]>([0, 0]);
    const [rotate, setRotate] = useState(0);
    useEffect(() => {
      if (!canvas.current) return;
      const div = canvas.current;
      const { offsetHeight, offsetWidth } = div;
      const hmin = offsetHeight / root.height;
      const wmin = offsetWidth / root.width;
      setScale(Math.min(hmin, wmin) * 0.9);
      setOffset([
        (offsetWidth - root.width) / 2,
        // (offsetHeight - root.height) / 2,
        0,
      ]);
      div.scrollTo({
        top: (root.height - offsetHeight) / 2,
      });
      //
    }, [canvas.current]);

    return (
      <div className="draw-main">
        <div
          className="draw-canvas"
          ref={canvas}
          // focusable
          tabIndex={0}>
          <RenderRoot
            root={root}
            offset={offset}
            scale={scale}
            focusId={-1}
            rotate={rotate}
          />
        </div>
        <Collapse
          className="draw-object"
          bordered={false}
          defaultActiveKey={['1']}>
          <Collapse.Panel header="缩放画板" key="1">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon
                type="minus-circle"
                style={{ cursor: 'pointer' }}
                onClick={() => setScale(scale - 0.001)}
              />
              <Slider
                style={{ flex: 'auto', position: 'relative', top: '-2px' }}
                min={0}
                max={100}
                onChange={scale => setScale((scale as any) / 100)}
                value={scale * 100}
              />
              <Icon
                type="plus-circle"
                style={{ cursor: 'pointer' }}
                onClick={() => setScale(scale + 0.001)}
              />
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="This is panel header 2" key="2">
            <p>Option</p>
          </Collapse.Panel>
          <Collapse.Panel header="This is panel header 3" key="3">
            <p>Option</p>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
);
interface RenderRootProps {
  root: NodeRoot;
  focusId: number;
  scale: number;
  offset: [number, number];
  rotate: number;
}
export function RenderRoot({ root, offset, scale, rotate }: RenderRootProps) {
  return (
    <div
      style={{
        transformOrigin: 'center',
        transform: `translate(${offset[0]}px, ${
          offset[1]
        }px) scale(${scale}) rotateY(${(rotate % 2) * 180}deg)`,
        width: `${root.width}px`,
        height: `${root.height}px`,
        display: 'flex',
        flexDirection: root.flow,
      }}>
      {root.children.map(child => render(child, root))}
    </div>
  );
}

export function render(node: Node, root: Node) {
  switch (node.type) {
    // case Type.ROOT: see RenderRoot
    case Type.LOCK:
      return (
        <div
          key={node.id}
          style={{
            // flex: `0 0 ${node.offset + lockwidth(root as NodeRoot)}px`,
            flex: `0 0 0.5%`,
            background: 'black',
          }}
        />
      );
    case Type.MAIN:
      return (
        <div
          key={node.id}
          style={{
            display: 'flex',
            flexDirection: node.flow,
            flex: 'auto',
          }}>
          {node.children.map(child => render(child, node))}
        </div>
      );
    case Type.AREA:
      return (
        <div
          key={node.id}
          style={{
            display: 'flex',
            flexDirection: node.flow || 'row',
            flex: `${node.grow} ${node.grow} ${node.size}px`,
          }}>
          {(node.children || []).map(child => render(child, node))}
        </div>
      );
    case Type.PIPE:
      return (
        <div
          key={node.id}
          style={{
            flex: `0 0 ${node.pipe.width}px`,
            background: node.pipe.color,
            boxSizing: 'border-box',
          }}
        />
      );
    case Type.BONE:
      return (
        <div
          style={{
            width: `${node.bone.width}px`,
            height: `${node.bone.height}px`,
            backgroundImage: `url(${node.bone.url})`,
          }}
        />
      );
  }
}
