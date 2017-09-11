import Koa from 'koa';
import middleware from 'koa-webpack';
import webpack from 'webpack';
import config from '../webpack.config';

const app = new Koa();
const compiler = webpack(config);

const hotPort = process.env.PORT || 8080;
const dev = {
  noInfo: true,
  quiet: true,
  publicPath: config.output.publicPath,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  stats: {
    colors: true
  }
};
app.use(middleware({
  compiler,
  dev
}));

app.listen(hotPort, () => {
  console.info(`==> 🌎 Listening on port ${hotPort}. Open up http://localhost:${hotPort}/ in your browser.`);
});
