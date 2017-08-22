
// server.js
const fs = require('fs');
const url = require('url');
const path = require('path');

const color = require('colorful');
const Koa = require('koa');
const Static = require('koa-static-cache');
const router = require('./router.js');

let app = new Koa();

/* 访问日志 logger */
app.use(async function (ctx, next) {
  console.log(color.green('Api Manager Server'), (new Date()).toLocaleString(), 'url:', ctx.url);
  await next();
});

/* static */
app.use(Static('./static', {
  prefix: '/static'
}));

/* 路由 router */
router(app);

/* 启动 Server */
let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Api Manager started on:', color.green(`http://127.0.0.1:${port}/`));
  console.log('Api Manager pid:', color.green(process.pid));
});