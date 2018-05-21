const { join, resolve } = require('path');

const pkg = require('../package.json');

const IS_DEV = process.env.NODE_ENV === 'development';
const browsers = ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'];
const publicPath = './';

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

const stylesLoader = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      config: {
        path: '../postcss.config.js'
      }
    }
  }
];
const PATHS = {
  app: join(__dirname, '../src'),
  build: join(__dirname, '../dist')
};

const baseConfig = {
  mode: IS_DEV ? 'development' : 'production',
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: IS_DEV ? '[name].js' : '[name].[chunkhash:4].js',
    publicPath,
    chunkFilename: IS_DEV ? 'name.[chunk].js' : '[name].[chunkhash].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: resolve(__dirname, './src'),
        loader: 'babel-loader',
        options: babelConfig,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: stylesLoader,
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: 'file-loader'
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      }
    ]
  }
};

export default baseConfig;
