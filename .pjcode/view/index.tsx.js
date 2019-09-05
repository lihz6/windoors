const { kebabCase } = require('lodash');
const { headers } = require('..');
module.exports = function(name) {
  return [
    ...headers(),
    `import React, { ReactNode, ReactEventHandler } from 'react';`,
    `// import { Link } from 'react-router-dom';`,
    `// import { Icon } from 'antd';`,
    `// import chunk from 'lodash/chunk';`,
    `// import { tree } from '_util';`,
    ``,
    `import './style.scss';`,
    ``,
    `export interface ${name}Props {`,
    `  //`,
    `}`,
    ``,
    `export default function ${name}({  }: ${name}Props) {`,
    `  return <div className="${kebabCase(name)}-main">${name}</div>;`,
    `}`,
    ``,
  ].join('\n');
};
