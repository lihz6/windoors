/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/13/2019, 1:38:53 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { Dispatch, SetStateAction } from 'react';
// import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';
// import chunk from 'lodash/chunk';
// import { tree } from '_util';
import { Node, Type, NodeMain } from '_type/struct';
import useDuplicate from './useDuplicate';
import useDelete from './useDelete';
import useClear from './useClear';

import './style.scss';

export interface DrawMenuProps {
  setMainNode: Dispatch<SetStateAction<NodeMain>>;
  newNodeId(): number;
  focusNode: Node[];
}

export default function DrawMenu({
  focusNode,
  setMainNode,
  newNodeId,
}: DrawMenuProps) {
  /* 左右移·上下翻·去焦·清空·删除·全屏·视角 */
  const [cantDuplicate, duplicateNode] = useDuplicate(
    setMainNode,
    focusNode,
    newNodeId
  );
  const [cantDelete, deleteNode] = useDelete(setMainNode, focusNode);
  const [cantClear, clearNode] = useClear(setMainNode, focusNode);
  return (
    <div className="draw-menu-main">
      <Button.Group size="small" style={{ display: 'flex' }}>
        <Button type="default" disabled={cantDuplicate} onClick={duplicateNode}>
          重复
        </Button>
        <Button type="default" disabled={cantClear} onClick={clearNode}>
          清空
        </Button>
        <Button type="default" disabled={cantDelete} onClick={deleteNode}>
          删除
        </Button>
        <Button type="default">全屏</Button>
        <Button type="primary">视角</Button>
      </Button.Group>
    </div>
  );
}
