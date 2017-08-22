
class Response {
  constructor(status, data, key) {
    this.status = status;
    this.data = data;
    this.key = key;
  }
  get() {
    let json = {
      code: this.status,
      message: '',
      data: {}
    };

    if (this.key) {
      json.data[this.key] = this.data;
    } else {
      json.data = this.data;
    }
    return json;
  }
}

Response.success = function(key, data) {
  return (new Response('SUCCESS', key, data)).get();
};

Response.error = function(key, data) {
  return (new Response('UNKNOW_ERROR', key, data)).get();
};

module.exports = {
  success: Response.success,
  error: Response.error
}
