/*
  异步请求，使用fetch API.
  IE下使用polyfill
*/
import 'whatwg-fetch';
import HttpStatus from 'http-status';
import qs from 'querystring';

export default class Ajax {

  /*
    注意：参数通过options.params传递，例如Ajax.get(url, {params: {id:9527}})
  */
  static get(url, options = {}) {
    if (!url) url = '/';
    if (!options) options = {};
    options.method = 'GET';

    if (typeof options.params === 'object') {
      if (url.indexOf('?') < 0) {
        url += `?${qs.stringify(options.params)}`;
      } else {
        url += `&${qs.stringify(options.params)}`;
      }
      delete options.params;
    }

    return Ajax.request(url, options);
  }

  /*
    注意：参数通过options.body传递，例如Ajax.post(url, {body: {id:9527}})
  */
  static post(url, options = {}) {
    if (!url) url = '/';
    if (!options) options = {};
    options.method = 'POST';

    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    return Ajax.request(url, options);
  }

  /*
    注意：参数通过options.body传递，例如Ajax.put(url, {body: {id:9527}})
  */
  static put(url, options = {}) {
    if (!url) url = '/';
    if (!options) options = {};
    options.method = 'PUT';

    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    return Ajax.request(url, options);
  }

  /*
    注意：参数通过options.params传递，例如Ajax.del(url, {params: {id:9527}})
  */
  static del(url, options = {}) {
    if (!url) url = '/';
    if (!options) options = {};
    options.method = 'DELETE';

    if (typeof options.params === 'object') {
      if (url.indexOf('?') < 0) {
        url += `?${qs.stringify(options.params)}`;
      } else {
        url += `&${qs.stringify(options.params)}`;
      }
      delete options.params;
    }

    return Ajax.request(url, options);
  }

  static request(url, options) {
    if (!url) url = '/';
    if (!options) options = {};

    options = Object.assign({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 要这样设置才能带上cookie
    }, options);

    return fetch(url, options).then(res => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      } else {
        let error = new Error(`Error: ${HttpStatus[res.status]}. Url: ${url}`);
        return Promise.reject(error);
      }
    }).then(data => {
      return data;
    });
  }
}
