// server.js

const fs = require('fs');
const url = require('url');
const path = require('path');

const color = require('colorful');
const Koa = require('koa');
const Static = require('koa-static');
const BodyParser = require('koa-bodyparser');

const router = require('./router.js');
const logger = require('./common/logger');

let app = new Koa();

/* access logger */
app.use(async function (ctx, next) {
  logger.log('%s %s', ctx.req.method, ctx.url);
  await next();
});

/* error handler */
app.use(async function (ctx, next) {
  try {
    await next();
  } catch(error) {
    logger.error(error);
    ctx.body = {
      code: error.code || error.name || 'UNKNOW_ERROR',
      message: error.message
    }
  }
});

/* static */
app.use(Static('./static/build/production'));
app.use(Static('./static/build/production/pages/home'));

/* body */
app.use(BodyParser());

/* 路由 router */
router(app);

/* 启动 Server */
let port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Api Manager started on:', color.green(`http://127.0.0.1:${port}/`));
  console.log('Api Manager pid:', color.green(process.pid));
});