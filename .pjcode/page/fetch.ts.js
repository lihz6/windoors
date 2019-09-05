const { kebabCase } = require('lodash');
const { headers } = require('..');
module.exports = function(name, dirs) {
  const path = dirs.map(d => `/${d}`).join('');
  return [
    ...headers(),
    `import fetch from '_fetch';`,
    ``,
    `export function getData(page, size) {`,
    `  return fetch(\`${path}/\${page}/\${size}?page=\${page}&size=\${size}\`);`,
    `}`,
    ``,
  ].join('\n');
};
