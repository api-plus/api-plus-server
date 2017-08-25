import Ajax from '../ajax';

export default class Apis {
  store = {};
  constructor() {

  }
  async get(id) {
    if (this.store[id]) {
      return this.store[id];
    } else {
      let api = (await Ajax.get('/apis/' + id)).data;
      return this.store[id] = api;
    }
  }
}