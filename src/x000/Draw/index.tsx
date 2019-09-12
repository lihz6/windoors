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

import { Icon, Slider, Collapse } from 'antd';
import withPath from '_base/withPath';
import DrawScale from '_view/DrawScale';
import DrawNode from '_view/DrawNode';
import DrawGrid from '_view/DrawGrid';
import DrawMenu from '_view/DrawMenu';
import { NodeMain, Node, findNode, containNode, Type } from './struct';
import { data } from './data';
import useScale from './useScale';
import useFocus from './useFocus';
import { getData } from './fetch';
import './style.scss';

export default withPath('/x000/draw', {}, {})(
  ({ history, match: { params } }) => {
    const [mainNode, setMainNode] = useState<NodeMain>(data);
    const { focusNode, innerNode, onNodeFocus } = useFocus(mainNode);
    const canvas = useRef<HTMLDivElement>(null);
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
            onClick={onNodeFocus}
            focusId={focusNode ? focusNode.id : -1}
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
          {/* 左右移·上下翻·去焦·清空·删除·全屏·插入·视角 */}
          <DrawMenu />
          <DrawGrid
            squared={9}
            disabled={!innerNode || innerNode.type !== Type.AREA}
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
