require('dotenv').config();

const {
  REACT_APP_CODER = '`.env.local#REACT_APP_CODER`',
  REACT_APP_EMAIL = '`.env.local#REACT_APP_EMAIL`',
} = process.env;

exports.headers = () => [
  `/**`,
  // cp .env .env.local
  // make change to .env.local
  ` * \`\`\``,
  ` * ${REACT_APP_CODER} <${REACT_APP_EMAIL}>`,
  ` * ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })}`,
  ` * \`\`\``,
  ` * doc comment for the file goes here`,
  ` */`,
  ``,
  `/** Happy Coding */`,
];

exports.comment = file => {
  const fs = require('fs');
  const text = fs.readFileSync(file, {
    encoding: 'utf-8',
  });

  function reduce(text, data) {
    const match = /^\/{3} *(.+)$/im.exec(text);
    if (!match) return data;
    data.push(`// ${match[1]}`);
    return reduce(text.slice(match.index + match[0].length), data);
  }

  return reduce(text, []);
};
