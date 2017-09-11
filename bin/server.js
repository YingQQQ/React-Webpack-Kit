#!/usr/bin/env node

const isSteam = require('piping')({
  hook: true,
  ignore: /(\/\.|~$|\.json$)/i
});
if (process.env.NODE_ENV !== 'production' && !isSteam) {
   return;
}
require('../server.babel'); // babel registration (runtime transpilation for node)
require('../config/dev.server');