const {
  resolve
} = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Paths = require('./toolsConfig/path-help');
const htmlTemplate = require('html-webpack-template');

console.log(Paths.App);
console.log(Paths.Style);

const IS_DEV = process.env.npm_lifecycle_event === 'start';
const pkg = require('./package.json');

const babelConfig = Object.assign({}, pkg.babelConfig, {
  babelrc: false,
  cacheDirectory: IS_DEV,
  presets: pkg.babelConfig.presets.map(key => (key === 'env' ? ['env', {
    targets: {
      browsers: ['last 2 versions', 'safari >= 7']
    },
    modules: false
  }] : key))
});

let stylesLoader = [
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
        path: './postcss.config.js'
      }
    }
  },
];
if (!IS_DEV) {
  const fallback = stylesLoader.shift();

  stylesLoader = ExtractTextPlugin.extract({
    fallback,
    use: stylesLoader
  });
}

const config = {
  devtool: IS_DEV ? 'eval-source-map' : 'source-map',
  entry: {
    app: [
      Paths.App
    ],
    style: Paths.Style
  },
  output: {
    path: Paths.Build,
    chunkFilename: '[chunkhash].js',
    filename: IS_DEV ? '[name].js' : '[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: resolve(__dirname, './src'),
      loader: 'babel-loader',
      options: babelConfig
    }, {
      test: /\.s?css$/,
      use: stylesLoader
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }, {
      test: /\.(eot|ttf|wav|mp3)$/,
      loader: 'file-loader'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: htmlTemplate,
      title: '项目名称',
      appMountId: 'app',
      inject: false,
      favicon: './apple-icon-60x60.png',
      mobile: true,
    })
  ]
};
if (IS_DEV) {
  config.devServer = {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
    publicPath: '/'
  };
  babelConfig.plugins.unshift('react-hot-loader/babel');
  config.entry.app.unshift('react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server');
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin(), new webpack.HotModuleReplacementPlugin());
} else {
  config.plugins.push(new CleanWebpackPlugin([Paths.Build], {
    root: process.cwd()
  }), new webpack.optimize.CommonsChunkPlugin({
    names: [
      ['react', 'react-dom'], 'manifest'
    ],
    minChunks: Infinity
  }), new webpack.LoaderOptionsPlugin({
    minimize: true
  }), new ExtractTextPlugin('[name].[chunkhash].css'), new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false,
    }
  }));
}
module.exports = config;
