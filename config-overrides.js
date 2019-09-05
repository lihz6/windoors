const fs = require('fs');
const path = require('path');
const {
  addWebpackResolve,
  fixBabelImports,
  addLessLoader,
  override,
} = require('customize-cra');

const text = fs.readFileSync('src/_sass/_antd.scss', { encoding: 'utf-8' });

function reduce(text, data) {
  const match = /^\$([-a-z0-9]+): *(.+);$/im.exec(text);
  if (!match) return data;
  data[`@${match[1]}`] = match[2];
  return reduce(text.slice(match.index + match[0].length), data);
}
const modifyVars = reduce(text, {});
// A hack to address create-react-app doesn't support `paths`
fs.readdirSync(path.join(__dirname, 'src'))
  .filter(d => d.startsWith('_'))
  .forEach(d => {
    const link = path.join(__dirname, 'node_modules', d);
    // if (fs.existsSync(link) && fs.statSync(link).isSymbolicLink()) {
    //   fs.unlinkSync(link);
    // }
    if (!fs.existsSync(link)) {
      fs.symlinkSync(
        path.join('..', 'src', d),
        path.join(__dirname, 'node_modules', d),
        'dir'
      );
    }
  });

module.exports = override(
  // fixBabelImports('antd-mobile', {
  //   libraryName: 'antd-mobile',
  //   style: true
  // }),
  fixBabelImports('antd', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: modifyVars,
  }),
  addWebpackResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: fs
      .readdirSync(path.join(__dirname, 'src'))
      .filter(d => d.startsWith('_'))
      .reduce((o, d) => ((o[d] = path.join(__dirname, 'src', d)), o), {}),
  })
);
