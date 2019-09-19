/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/5/2019, 7:41:10 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, {
  useState,
  useEffect,
  useRef,
  SyntheticEvent,
  ReactElement,
  ReactHTMLElement,
  ReactEventHandler,
  useContext,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Collapse, Input, Button, InputNumber } from 'antd';
import withPath from '_base/withPath';
import { context } from '_base/Context';
import DrawBase from '_view/DrawBase';
import DrawScale from '_view/DrawScale';
import DrawNode from '_view/DrawNode';
import DrawGrid from '_view/DrawGridBox';
import DrawMenu from '_view/DrawMenu';
import DrawSize from '_view/DrawSize';
import { Type, Flow, Node } from './struct';
import useMnode from './useMnode';
import useScale from './useScale';
import useFocus from './useFocus';
import { getData } from './fetch';
import './style.scss';

export default withPath('/x000/draw', {}, {})(
  ({ history, match: { params } }) => {
    const { username } = useContext(context);
    const [data, setData] = useState<Omit<DrawProps, 'author'> | null>({
      width: 1800,
      height: 2400,
      title: 'Windoors',
      flow: Flow.L2R,
      position: '01',
    });
    if (data) {
      return <Draw author={username} {...data} />;
    }
    return (
      <div className="draw-init">
        <DrawBase onSubmit={data => setData(data)} />
      </div>
    );
  }
);

export interface DrawProps {
  width: number;
  height: number;
  title: string;
  author: string;
  flow: Flow;
  position: string;
}
function Draw(props: DrawProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const {
    duplicateNodeById,
    setMainNodeData,
    addBorderToNode,
    deleteNodeById,
    clearNodeById,
    addFromGrid,
    mainNode,
  } = useMnode(props);
  const { focusNode, innerNode, setFocusNode } = useFocus(mainNode);
  const {
    setMinScale,
    setMaxScale,
    setScale,
    minScale,
    maxScale,
    offset,
    scale,
  } = useScale(mainNode, canvas);
  return (
    <div className="draw-main">
      <div className="draw-canvas" ref={canvas} tabIndex={0}>
        <DrawNode
          onClick={setFocusNode}
          focusId={focusNode.length && focusNode[0].id}
          offset={offset}
          scale={scale}
          mainNode={mainNode}
        />
      </div>
      <div className="draw-object">
        <DrawScale
          setMinScale={setMinScale}
          setMaxScale={setMaxScale}
          setScale={setScale}
          minScale={minScale}
          maxScale={maxScale}
          scale={scale}
        />
        <DrawMenu
          focusNode={focusNode}
          onClick={(action, node) => {
            switch (action) {
              case 'duplicate':
                return duplicateNodeById(node.id);
              case 'delete':
                return deleteNodeById(node.id);
              case 'clear':
                return clearNodeById(node.id);
            }
          }}
        />
        <DrawGrid
          key={innerNode.length && innerNode[0].id}
          focusNode={focusNode}
          innerNode={innerNode}
          onBorderClick={(border, node) => {
            if (node) {
              return deleteNodeById(node.id);
            }
            addBorderToNode(border, innerNode);
          }}
          squared={9}
          disabled={!innerNode.length || innerNode[0].type !== Type.AREA}
          onDone={(column, area) => {
            addFromGrid(innerNode[0], column, area);
            // setFocusNode(null);
          }}
        />
        <Collapse defaultActiveKey={['2']}>
          <Collapse.Panel header="框体设置" key="1">
            <DrawBase
              {...mainNode}
              size="small"
              key={focusNode.length && focusNode[0].id}
              onSubmit={data => setMainNodeData(data)}
              position={mainNode.children
                .map(({ type }) => Number(type === Type.LOCK))
                .join('')}
            />
          </Collapse.Panel>
          {focusNode[1] &&
            [Type.AREA, Type.FLEX, Type.GRID].includes(focusNode[0].type) && (
              <Collapse.Panel header="尺寸设置" key="2">
                <DrawSize focusNode={focusNode as any} />
              </Collapse.Panel>
            )}
          <Collapse.Panel header="出料清单" key="3">
            出料清单
          </Collapse.Panel>
        </Collapse>
        {/* 保存·打印 */}
      </div>
    </div>
  );
}

function configSize([child, parent]: Node[]) {
  if (!parent || [Type.PIPE, Type.LOCK, Type.BONE].includes(child.type)) {
    return null;
  }
}
