const ErrorCode = require('common-errors');

const logger = require('../common/logger');
const res = require('../common/jsonResponse');
const { Projects } = require('../models');

// 新建
exports.Post = async function(ctx) {
  let body = ctx.request.body;
  if (!body.name) {
    throw ErrorCode.ArgumentNullError('name');
  }

  ctx.body = res.success(await Projects.create(body));
}

// 删除
exports.Del = async function(ctx) {
  let id = ctx.params.id
  if (!id) {
    throw ErrorCode.ArgumentNullError('name');
  }

  let deleteCount = await Projects.destroy({
    where: { id }
  });
  if (!deleteCount) {
    throw ErrorCode.NotFoundError('id = ' + id);
  }
  ctx.body = res.success({
    id, deleteCount 
  });
}

// 修改
exports.Put = async function(ctx) {
  let body = ctx.request.body;
  let id = ctx.params.id || body.id;
  if (!body.id && !id) {
    throw ErrorCode.ArgumentNullError('id');
  }

  let [ affectedCount ] = await Projects.update(body, {
    where: { id }
  });
  if (!affectedCount) {
    throw ErrorCode.NotFoundError('id = ' + id);
  }
  ctx.body = res.success({
    id, affectedCount
  });
}

// 获取
exports.Get = async function(ctx) {
  let results = null;
  let id = ctx.params.id;
  if (id) {
    results = await Projects.findById(id);
    if (!results) {
      throw ErrorCode.NotFoundError('id = ' + id);
    }
  } else {
    results = await Projects.findAll();
  }

  ctx.body = res.success(results);
}