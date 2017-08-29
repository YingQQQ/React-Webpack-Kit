const {
  resolve
} = require('path');

const ROOT = resolve(__dirname, '..');
const Build = resolve(ROOT, 'build');
const App = resolve(ROOT, 'src', 'app.js');
const Style = resolve(ROOT, 'src', 'style');

const path = {
  ROOT,
  Build,
  App,
  Style
};

module.exports = path;
