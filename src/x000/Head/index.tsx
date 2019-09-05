/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 7/2/2019, 11:09:49 AM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Layout } from 'antd';
import withPath from '_base/withPath';
//import Component from '_view/Component';

import { getData } from './fetch';

export default withPath('/x000/head', {})(function Head({
  history,
  match: { params },
}) {
  const loading = true;

  useEffect(() => {
    document.title = 'Title';
  }, []);

  return (
    <Layout.Header
      className="-glob-box-shadow"
      style={{
        height: '85px',
        display: 'flex',
        padding: '0',
        backgroundColor: 'white',
      }}>
      Header
    </Layout.Header>
  );
});
