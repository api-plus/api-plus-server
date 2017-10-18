/* 路由 */
const router = require('koa-router')();

const Project = require('./controllers/project');

module.exports = function(app) {

  router.post('/api/projects', Project.Post);
  router.del('/api/projects/:id', Project.Del);
  router.put('/api/projects', Project.Put);
  router.put('/api/projects/:id', Project.Put);
  router.get('/api/projects', Project.Get);
  router.get('/api/projects/:id', Project.Get);


  app.use(router.routes()).use(router.allowedMethods());
}