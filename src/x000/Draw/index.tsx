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
import DrawGrid from '_view/DrawGrid';
import DrawMenu from '_view/DrawMenu';
import { Type } from './struct';
import useMnode from './useMnode';
import useScale from './useScale';
import useFocus from './useFocus';
import { getData } from './fetch';
import './style.scss';

export default withPath('/x000/draw', {}, {})(
  ({ history, match: { params } }) => {
    const canvas = useRef<HTMLDivElement>(null);
    const {
      mainNode,
      addFromGrid,
      clearNodeById,
      deleteNodeById,
      duplicateNodeById,
    } = useMnode();
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
                case 'clear':
                  clearNodeById(node.id);
                  return setFocusNode(null);
                case 'delete':
                  deleteNodeById(node.id);
                  return setFocusNode(null);
                case 'duplicate':
                  duplicateNodeById(node.id);
                  return setFocusNode(null);
              }
            }}
          />
          <DrawGrid
            key={innerNode.length && innerNode[0].id}
            squared={9}
            disabled={!innerNode.length || innerNode[0].type !== Type.AREA}
            onDone={(column, area) => {
              addFromGrid(innerNode[0], column, area);
              setFocusNode(null);
            }}
          />
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Collapse.Panel header="框体设置" key="1">
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
);
