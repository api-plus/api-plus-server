exports.Post = async function(ctx) {
  ctx.body = '新建';
}

exports.Del = async function(ctx) {
  ctx.body = '删除';
}

exports.Put = async function(ctx) {
  ctx.body = '修改';
}

exports.Get = async function(ctx) {
  if (ctx.params.id) {
    ctx.body = `获取 id 为 ${ctx.params.id} 的 api`;
  } else {
    ctx.body = '获取 api 列表';
  }
}