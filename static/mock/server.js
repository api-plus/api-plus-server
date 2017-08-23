
// mock/server.js
const fs = require('fs');
const url = require('url');
const path = require('path');
const color = require('colorful');

const Koa = require('koa');
const router = require('koa-router')();

let app = new Koa();

/* 访问日志，logger */
app.use(async function (ctx, next) {
  console.log(color.green('Mock Server'), (new Date()).toLocaleString(), 'url:', ctx.url);
  await next();
});

/* 路由，router */
router.all('*', async (ctx) => {
  let pathname = url.parse(ctx.url).pathname;
  let filepath = path.resolve(__dirname, 'data', `./${pathname}.json`);
  let methodFilepath = path.resolve(__dirname, 'data', `./${pathname}.${ctx.method}.json`);
  if(fs.existsSync(filepath)) {
    ctx.body = fs.readFileSync(filepath);
  } else if(fs.existsSync(methodFilepath)) {
    ctx.body = fs.readFileSync(methodFilepath);
  } else {
    ctx.status = 404;
    ctx.body = 'Mock data not found';
  }
}); 
app.use(router.routes()).use(router.allowedMethods());

/* 启动 Mock Server */
exports.start = function(port) {
  app.listen(port, () => {
    console.log('Mock Server started on', color.green(`http://127.0.0.1:${port}/`));
  });
  return app;
}