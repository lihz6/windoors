/**
 * 李鸿章 <poodll@163.com>
 * 6/27/2019, 3:38:42 PM
 */

import React from 'react';
import { Spin } from 'antd';

export default function Init() {
  return (
    <Spin
      spinning
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
