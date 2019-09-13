/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/13/2019, 1:38:53 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { ReactNode, ReactEventHandler } from 'react';
// import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';
// import chunk from 'lodash/chunk';
// import { tree } from '_util';
import { Node, Type } from '../../x000/Draw/struct';

import './style.scss';

export interface DrawMenuProps {
  focusNode: Node | null;
  onClick(action: 'clear'): void;
}

export default function DrawMenu({ focusNode, onClick }: DrawMenuProps) {
  {
    /* 左右移·上下翻·去焦·清空·删除·全屏·插入·视角 */
  }

  return (
    <div className="draw-menu-main">
      <Button.Group size="small" style={{ display: 'flex' }}>
        {/* <Button>左右移</Button> */}
        {/* <Button>上下翻</Button> */}
        {/* <Button>去焦</Button> */}
        <Button type="default">重做</Button>
        <Button
          type="default"
          disabled={
            !focusNode ||
            (focusNode.type !== Type.FLEX && focusNode.type !== Type.GRID)
          }
          onClick={() => onClick('clear')}>
          清空
        </Button>
        <Button type="default">全屏</Button>
        <Button type="default">插入</Button>
        <Button type="primary">视角</Button>
      </Button.Group>
    </div>
  );
}
