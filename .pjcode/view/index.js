const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
// module.exports = function() {
const base = process.env.INIT_CWD;
const name = process.argv[2];
if (!/^([A-Z][a-z0-9]*){2,}$/.test(name)) {
  console.log(chalk.red(`${name}: Incorrect name convention...`));
  process.exit();
}
if (fs.existsSync(path.join(base, name))) {
  console.log(chalk.red(`${path.join(base, name)} exists...`));
  process.exit();
} else {
  fs.mkdirSync(path.join(base, name));
}
const files = ['index.tsx', 'style.scss'];
files.forEach(file => {
  fs.createWriteStream(path.join(base, name, file)).write(
    require(`./${file}.js`)(name)
  );
  console.log(chalk.green('Created: ' + path.join(base, name, file)));
});
// };
