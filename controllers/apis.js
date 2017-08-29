const ErrorCode = require('common-errors');

const { success } = require('../common/jsonResponse');
const { APIs, Parameters, Responses } = require('../models');

// create
exports.Post = async function(ctx) {
  let body = ctx.request.body;
  if (!body.path) {
    throw ErrorCode.ArgumentNullError('path');
  }
  if (!body.project_id) {
    throw ErrorCode.ArgumentNullError('project_id');
  }

  ctx.body = success(await APIs.create(body));
}

// destroy
exports.Del = async function(ctx) {
  let id = ctx.params.id
  if (!id) {
    throw ErrorCode.ArgumentNullError('id');
  }

  let deleteCount = await APIs.destroy({
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

  let [ affectedCount ] = await APIs.update(body, {
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
    results = await APIs.findById(id);
    if (!results) {
      throw ErrorCode.NotFoundError('id = ' + id);
    }
  } else {
    results = await APIs.findAll();
  }

  ctx.body = success(results);
}