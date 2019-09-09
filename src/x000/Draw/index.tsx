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
import { data, NodeMain, Node, Type, listPath, nodeContains } from './struct';
import tree from '_util/_tree';
import useScale from './useScale';
import { getData } from './fetch';
import './style.scss';

export default withPath('/x000/draw', {}, {})(
  ({ history, match: { params } }) => {
    const [mainNode, setMainNode] = useState<NodeMain>(data);
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
    const [focusId, setFocusId] = useState(-1);
    const onNodeClick = (event: SyntheticEvent, node: Node) => {
      event.stopPropagation();
      const list = listPath(mainNode, focusId);
      if (list.length < 3 || !nodeContains(list[0] as NodeMain, node.id)) {
        setFocusId(node.id);
      } else {
        setFocusId(list[1].id);
      }
    };

    return (
      <div className="draw-main">
        <div className="draw-canvas" ref={canvas} tabIndex={0}>
          <DrawNode
            onClick={onNodeClick}
            focusId={focusId}
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
          <DrawGrid squared={9} />
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Collapse.Panel header="墙面大小" key="1">
              墙面大小
            </Collapse.Panel>
            <Collapse.Panel header="开口位置" key="2">
              开口位置
            </Collapse.Panel>
            <Collapse.Panel header="其他设置" key="3">
              其他设置
            </Collapse.Panel>
          </Collapse>
        </div>
      </div>
    );
  }
);
