/* 路由 */
const router = require('koa-router')();

const Projects = require('./controllers/projects');
const Api = require('./controllers/apis');
const Parameters = require('./controllers/Parameters');
const Responses = require('./controllers/responses');

module.exports = function(app) {

  router.post('/projects', Projects.Post);
  router.del('/projects/:id', Projects.Del);
  router.put('/projects', Projects.Put);
  router.put('/projects/:id', Projects.Put);
  router.get('/projects', Projects.Get);
  router.get('/projects/:id', Projects.Get);

  router.post('/apis', Api.Post);
  router.del('/apis/:id', Api.Del);
  router.put('/apis', Api.Put);
  router.put('/apis/:id', Api.Put);
  router.get('/apis', Api.Get);
  router.get('/apis/:id', Api.Get);

  // router.post('/parameters', Parameters.Post);
  // router.del('/parameters/:id', Parameters.Del);
  // router.put('/parameters', Parameters.Put);
  // router.put('/parameters/:id', Parameters.Put);
  // router.get('/parameters', Parameters.Get);
  // router.get('/parameters/:id', Parameters.Get);

  // router.post('/responses', Responses.Post);
  // router.del('/responses/:id', Responses.Del);
  // router.put('/responses', Responses.Put);
  // router.put('/responses/:id', Responses.Put);
  // router.get('/responses', Responses.Get);
  // router.get('/responses/:id', Responses.Get);

  app.use(router.routes()).use(router.allowedMethods());
}