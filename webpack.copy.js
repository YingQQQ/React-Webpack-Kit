const { join } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const parts = require('./config/webpack.parts');
const pkg = require('./package.json');

const IS_DEV = process.env.NODE_ENV === 'development';
const browsers = ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'];
const PUBLIC_PATH = './';
// const port = 8080;

const PATHS = {
  app: join(__dirname, 'src'),
  build: join(__dirname, 'dist')
};
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

const commonConfig = merge([
  {
    output: {
      publicPath: PUBLIC_PATH
    }
  },
  parts.loadJavaScript({
    include: PATHS.app,
    exclude: /node_modules/,
    options: babelConfig
  }),
  // parts.loadImage(),
  // parts.loadFonts(),
  parts.loadCSS({
    include: PATHS.app,
    exclude: /node_modules/
  })
]);

const developmentConfig = merge([
  {
    entry: [
      // 'webpack-hot-middleware/client?reload=true',
      PATHS.app
    ]
  },
  {
    output: {
      filename: '[name].js',
      chunkFilename: '[chunkhash].js'
    }
  },
  parts.generateSourceMaps(),
  parts.setFreeVariable('__DEVELOPMENT__', 'true'),
  {
    plugins: [
      // 开启热更新
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  }
]);

const productionConfig = merge([
  {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 150000,
      maxAssetSize: 450000
    }
  },
  {
    recordsPath: join(__dirname, 'records.json'),
    output: {
      chunkFilename: '[name].[chunkhash:4].js',
      filename: '[name].[chunkhash:4].js'
    }
  },
  {
    plugins: ['react-hot-loader/babel']
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCss(),
  parts.extractCSS({
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
  }),
  parts.loadPWA({
    PUBLIC_PATH
  }),
  {
    optimization: {
      minimize: true,
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            name: 'vendors',
            enforce: true,
            chunks: 'initial'
          }
        }
      },
      runtimeChunk: {
        name: 'manifest'
      }
    }
  }
]);

module.exports = (mode) => {
  const pages = [
    parts.page({
      title: 'My App',
      entry: {
        app: PATHS.app
      },
      chunks: ['app', 'manifest', 'vendor'],
      favicon: '../apple-icon-60x60.png',
      mobile: true,
      meta: [
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes'
        },
        {
          name: 'x5-fullscreen',
          content: true
        },
        {
          name: 'full-screen',
          content: 'yes'
        },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui'
        }
      ]
    })
  ];
  const config = mode === 'production' ? productionConfig : developmentConfig;
  return merge([commonConfig, config, { mode }].concat(pages));
};
