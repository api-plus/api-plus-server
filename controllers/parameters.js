const ErrorCode = require('common-errors');

const { success } = require('../common/jsonResponse');
const { Parameters } = require('../models');

// create
exports.Post = async function(ctx) {
  let body = ctx.request.body;
  if (!body.name) {
    throw ErrorCode.ArgumentNullError('name');
  }
  if (!body.api_id) {
    throw ErrorCode.ArgumentNullError('api_id');
  }

  ctx.body = success(await Parameters.create(body));
}

// destroy
exports.Del = async function(ctx) {
  let id = ctx.params.id
  if (!id) {
    throw ErrorCode.ArgumentNullError('id');
  }

  let deleteCount = await Parameters.destroy({
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

  let [ affectedCount ] = await Parameters.update(body, {
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
    results = await Parameters.findById(id);
    if (!results) {
      throw ErrorCode.NotFoundError('id = ' + id);
    }
  } else {
    results = await Parameters.findAll();
  }

  ctx.body = success(results);
}