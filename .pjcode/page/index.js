const { kebabCase } = require('lodash');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
// module.exports = function() {
const base = process.env.INIT_CWD;
const name = process.argv[2];
if (!/^([A-Z][a-z0-9]*)+$/.test(name)) {
  console.log(chalk.red('Incorrect name convention...'));
  process.exit();
}
if (fs.existsSync(path.join(base, name))) {
  console.log(chalk.red(`${path.join(base, name)} exists...`));
  process.exit();
} else {
  fs.mkdirSync(path.join(base, name));
}
const files = ['index.tsx', 'fetch.ts'];
const dirs = parse(path.join(base, kebabCase(name)), []);
files.forEach(file => {
  fs.createWriteStream(path.join(base, name, file)).write(
    require(`./${file}.js`)(name, dirs)
  );
  console.log(chalk.green('Created: ' + path.join(base, name, file)));
});
// };
function parse(subdir, dirs) {
  const { root, dir, base } = path.parse(subdir);
  if (base === 'src' || root === dir) {
    return dirs;
  }
  dirs.unshift(base);
  return parse(dir, dirs);
}
