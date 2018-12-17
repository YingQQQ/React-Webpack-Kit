import historyFallback from 'koa2-history-api-fallback';
import Koa from 'koa';
import logger from 'koa-logger';
import koaWebpack from 'koa-webpack';
import webpack from 'webpack';
import serve from 'koa-static';
import { hotPort, PATHS } from './path-help';
import config from '../webpack.config';

const app = new Koa();
const isProd = process.env.NODE_ENV === 'production';
app.use(serve(PATHS.build));
app.use(historyFallback());
app.use(logger());

if (!isProd) {
  const compiler = webpack(config);
  const devMiddleware = {
    logLevel: 'warn',
    publicPath: config.output.publicPath,
    silent: true,
    stats: {
      colors: true
    },
    noInfo: false,
    quiet: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  };
  koaWebpack({ compiler, devMiddleware }).then((middleware) => {
    app.use(middleware);
  });
}

app.listen(hotPort, () => {
  console.info(
    `==> 🌎 Listening on port ${hotPort}. Open up http://localhost:${hotPort}/ in your browser.`
  );
});
