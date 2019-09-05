/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 7/2/2019, 11:09:45 AM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Spin } from 'antd';
import withPath from '_base/withPath';
//import Component from '_view/Component';

export default function Menu({ history }: RouteComponentProps) {
  useEffect(() => {
    document.title = 'Title';
  }, []);

  return <div>Menu</div>;
}
