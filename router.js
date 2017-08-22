/* 路由 */
const router = require('koa-router')();

const Api = require('./controllers/apis');
const Projects = require('./controllers/projects');

module.exports = function(app) {
  router.post('/projects', Projects.Post);
  router.del('/projects/:id', Projects.Del);
  router.put('/projects', Projects.Put);
  router.put('/projects/:id', Projects.Put);
  router.get('/projects', Projects.Get);
  router.get('/projects/:id', Projects.Get);

  router.post('/apis', Api.Post);
  router.del('/apis/:id', Api.Del);
  router.put('/apis/:id', Api.Put);
  router.get('/apis', Api.Get);
  router.get('/apis/:id', Api.Get);

  app.use(router.routes()).use(router.allowedMethods());
}