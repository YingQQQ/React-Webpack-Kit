//  enable runtime transpilation to use ES6/7 in node

const babelrc = require('./package.json').babelConfig;

let config;

try {
  config = Object.assign({}, babelrc, {
    presets: babelrc.presets.map(key => (key === 'env' ? ['env', {
      targets: {
        node: true
      },
    }] : null))
  });
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc or config babelrc in pkg');
  console.error(err);
}

require('babel-register')(config);
