const CleanWebpackPlugin = require('clean-webpack-plugin');
const htmlTemplate = require('html-webpack-template');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const webpack = require('webpack');

/**
 * 页面配置，入口文件，chunks命名，favicon文件路径，生成index配置信息
 * @param {Object} param0
 * @param { String } entry
 * @param { String } title
 * @param { String } path
 * @param { String | Array String } chunks
 * @param { plugin | index.html } template
 * @param { String } favicon,
 * @param { others config } ...others E.g mata tags
 * @returns { Object } | webpack plugin and entry file
 */
exports.page = ({
  entry,
  title,
  path = '',
  chunks,
  template = htmlTemplate,
  favicon,
  ...others
} = {}) => ({
  entry,
  plugin: [
    new HtmlWebpackPlugin({
      chunks,
      filename: `${path && `${path}/`}index.html`,
      template,
      title,
      inject: false,
      appMountId: 'app',
      favicon,
      ...others
    })
  ]
});

/**
 * 压缩js文件，用于PROD
 * @returns { Object } webpack optimization config
 */
exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [
      new UglifyWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  }
});

/**
 * 用于PROD时删除之前的文件
 * @param {String} path
 * @returns { Array } webpack plugin
 */
exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])]
});

/**
 * Environment Variables 环境变量设置
 * @param {String} key
 * @param {String} value
 */
exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)]
  };
};

/**
 * Loading JavaScript,Using Babel with Webpack Configuration/JS编译
 * @param {Object} babel-loader options
 */
exports.loadJavaScript = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include,
        exclude,
        use: 'babel-loader',
        options
      }
    ]
  }
});

/**
 * 增强调试过程,在开发过程中使用eval-source-map加快构建速度同时提供正确的映射关系
 * 生产过程使用source-map,因为打包后的代码将所有生成的代码视为一大块代码。你看不到相互分离的模块只能使用source-map
 * 只在开发过程中加入devtool
 * @param {String} mode
 */
exports.generateSourceMaps = () => ({
  devtool: 'eval-source-map'
});

/**
 * 提取样式/Separating CSS
 * @param {String} include | exclude | use, Module.rules, see Webpack Document
 */
exports.extractCSS = ({ include, exclude, use = [] }) => {
  const plugin = new MiniCssExtractPlugin({
    filename: '[name].[contenthash:4].css'
  });

  return {
    module: {
      rules: [
        {
          test: /\.s?css$/,
          include,
          exclude,
          use: [MiniCssExtractPlugin.loader].concat(use)
        }
      ]
    },
    plugins: [plugin],
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  };
};

/**
 * loading CSS/ Css编译
 * @param {Object} include | exclude, see webpack Document
 */
exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include,
        exclude,
        use: [
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
          },
          'sass-loader'
        ]
      }
    ]
  }
});

/**
 *压缩css,用于PROD
 */
exports.minifyCss = () => ({
  minimizer: [new OptimizeCSSAssetsPlugin({})]
});

/**
 * 字体加载/loading Fonts
 */
exports.loadFonts = () => ({
  test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
  use: 'file-loader'
});

/**
 * 图片加载/loading Images
 */
exports.loadImage = () => ({
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
});

/**
 * 渐进增强
 * @param {Object}
 * @param {String} PUBLIC_PATH
 */
exports.loadPWA = ({
  PUBLIC_PATH,
} = {}) => ({
  plugins: [
    new OfflinePlugin({
      relativePaths: false,
      publicPath: PUBLIC_PATH,
      caches: {
        main: [':rest:'],
        additional: ['*.chunk.js'],
      },
      safeToUseOptionalCaches: true,
      AppCache: false,
    }),
  ]
});
