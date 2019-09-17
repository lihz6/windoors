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
} from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Collapse } from 'antd';
import withPath from '_base/withPath';
import DrawScale from '_view/DrawScale';
import DrawNode from '_view/DrawNode';
import DrawGrid from '_view/DrawGridBox';
import DrawMenu from '_view/DrawMenu';
import { Type } from './struct';
import useMnode from './useMnode';
import useScale from './useScale';
import useFocus from './useFocus';
import { getData } from './fetch';
import './style.scss';

export default withPath('/x000/draw', {}, {})(
  ({ history, match: { params } }) => {
    return (
      <Draw width={1800} height={2400} author="lihzhang" title="Windoors" />
    );
  }
);

export interface DrawProps {
  width: number;
  height: number;
  title: string;
  author: string;
}
function Draw(props: DrawProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const {
    duplicateNodeById,
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
          squared={12}
          disabled={!innerNode.length || innerNode[0].type !== Type.AREA}
          onDone={(column, area) => {
            addFromGrid(innerNode[0], column, area);
            // setFocusNode(null);
          }}
        />
        <Collapse bordered={false} defaultActiveKey={['1']}>
          <Collapse.Panel header="框体设置" key="1">
            {mainNode.title}
            {mainNode.width}
            {mainNode.height}
            框体宽高·开口位置·开口留白
          </Collapse.Panel>
          <Collapse.Panel header="其他设置" key="2">
            其他设置
          </Collapse.Panel>
          <Collapse.Panel header="出料清单" key="3">
            出料清单
          </Collapse.Panel>
        </Collapse>
        {/* 保存·打印 */}
      </div>
    </div>
  );
}
