const {
  resolve
} = require('path');

const ROOT = resolve(__dirname, '..');
const Build = resolve(ROOT, 'build');
const App = resolve(ROOT, 'src', 'index.js');
const Style = resolve(ROOT, 'src',
  'style', 'index.scss');

const path = {
  ROOT,
  Build,
  App,
  Style
};

module.exports = path;
