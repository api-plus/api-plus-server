/* 路由 */
const router = require('koa-router')();

const Api = require('./controllers/Apis');

module.exports = function(app) {
  router.post('/apis', Api.Post);
  router.del('/apis/:id', Api.Del);
  router.put('/apis/:id', Api.Put)
  router.get('/apis', Api.Get)
  router.get('/apis/:id', Api.Get);

  app.use(router.routes()).use(router.allowedMethods());
}