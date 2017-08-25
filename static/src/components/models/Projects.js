import Ajax from '../ajax';

class Projects {
  store = {};

  async get(id) {
    if (this.store[id]) {
      return this.store[id];
    } else {
      let api = (await Ajax.get('/projects/' + id)).data;
      return this.store[id] = api;
    }
  }
}

export default new Projects();