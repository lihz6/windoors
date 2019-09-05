const { kebabCase } = require('lodash');
const { headers, comment } = require('..');
const path = require('path');
const file = path.join(__dirname, '../../src/_sass/_vars.scss');
module.exports = function(name) {
  return [
    ...headers(),
    `@import '~_sass/vars';`,
    ``,
    ...comment(file),
    ``,
    `.${kebabCase(name)} {`,
    `  &-main {`,
    `    padding: 8px;`,
    `  }`,
    `}`,
    ``,
  ].join('\n');
};
