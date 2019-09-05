const camelCase = require('lodash/camelCase');
const { headers } = require('..');
module.exports = function(name, dirs) {
  const path = dirs.map(d => `/${d}`).join('');
  return [
    ...headers(),
    `import React, { useState, useEffect } from 'react';`,
    `import { RouteComponentProps } from 'react-router-dom';`,
    ``,
    `import { Spin } from 'antd';`,
    `import withPath from '_base/withPath';`,
    `//import Component from '_view/Component';`,
    ``,
    `import { getData } from './fetch';`,
    ``,
    `export default withPath('${path}', {}, {})(({`,
    `  history,`,
    `  match: { params },`,
    `}) => {`,
    // `  const loading = useGetter(() => {`,
    // `    // return Promise<void> or Promise.reject(errmsg)`,
    // `    return Promise.resolve();`,
    // `  });`,
    `  const loading = true;`,
    ``,
    `  return (`,
    `    <Spin spinning={loading}>`,
    `      <div>${name}</div>`,
    `    </Spin>`,
    `  );`,
    `});`,
    ``,
  ].join('\n');
};
