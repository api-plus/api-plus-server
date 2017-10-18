const ErrorCode = require('common-errors');

const { success } = require('../common/jsonResponse');
const { Project } = require('../models');

// create
exports.Post = async function(ctx) {
  let body = ctx.request.body;
  if (!body.spec) {
    throw ErrorCode.ArgumentNullError('spec');
  }

  ctx.body = success(await Project.create(body));
}

// destroy
exports.Del = async function(ctx) {
  let id = ctx.params.id
  if (!id) {
    throw ErrorCode.ArgumentNullError('id');
  }

  let deleteCount = await Project.destroy({
    where: { id }
  });
  if (!deleteCount) {
    throw ErrorCode.NotFoundError('id = ' + id);
  }
  ctx.body = success({
    id, deleteCount 
  });
}

// update
exports.Put = async function(ctx) {
  let body = ctx.request.body;
  let id = ctx.params.id || body.id;
  if (!body.id && !id) {
    throw ErrorCode.ArgumentNullError('id');
  }

  let [ affectedCount ] = await Project.update(body, {
    where: { id }
  });
  if (!affectedCount) {
    throw ErrorCode.NotFoundError('id = ' + id);
  }
  ctx.body = success({
    id, affectedCount
  });
}

// query
exports.Get = async function(ctx) {
  let results = null;
  let id = ctx.params.id;
  if (id) {
    results = await Project.findById(id);
    if (!results) {
      throw ErrorCode.NotFoundError('id = ' + id);
    }
  } else {
    results = await Project.findAll({
      order: [ 
        ['gmt_create', 'DESC']
      ]
    });
  }

  ctx.body = success(results);
}