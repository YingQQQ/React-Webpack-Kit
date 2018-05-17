const { join } = require('path');

const IS_DEV = process.env.NODE_ENV === 'development';
const pkg = require('./package.json');

const babelConfig = Object.assign({}, pkg.babelConfig, {
  babelrc: false,
  cacheDirectory: IS_DEV,
  presets: pkg.babelConfig.presets.map(
    key =>
      (key === 'env'
        ? [
          'env',
          {
            targets: {
              browsers: ['last 2 versions', 'safari >= 7']
            },
            modules: false
          }
        ]
        : key)
  )
});

const PATHS = {
  app: join(__dirname, 'src'),
  build: join(__dirname, 'dist')
};

