import Ajax from '../ajax';

class Apis {

  async get(id) {
    return (await Ajax.get('/apis/' + id)).data;
  }
}

export default new Apis();