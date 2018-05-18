const { join } = require('path');

const pkg = require('../package.json');

const IS_DEV = process.env.NODE_ENV === 'development';
const browsers = ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'];


const babelConfig = Object.assign({}, pkg.babelConfig, {
  // 没有.bablerc文件
  babelrc: false,
  // 在dev时设置成true来调用缓存，提高性能
  cacheDirectory: IS_DEV,
  presets: pkg.babelConfig.presets.map(
    key =>
      (key === '@babel/preset-env'
        ? [
          '@babel/preset-env',
          {
            targets: {
              browsers
            },
            modules: false
          }
        ]
        : key)
  )
});

const PATHS = {
  app: join(__dirname, '../src'),
  build: join(__dirname, '../dist')
};

const config = {
  mode: IS_DEV ? 'development' : 'production',
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: 
  }
};


export default config;
