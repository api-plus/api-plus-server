import { observable } from 'mobx';
import Ajax from '../components/ajax';
import Api from './Api.js';

export default class Project {
  id;
  @observable name;
  @observable description;
  @observable production;
  @observable testing;
  @observable development;
  @observable apis;

  constructor(project) {
    const { id, name, description, production, testing, development, apis = [] } = project;
    this.id = id || Date.now();
    this.name = name;
    this.description = description;
    this.production = production;
    this.testing = testing;
    this.development = development;
    this.apis = apis.map(api => (new Api(api)));
  }

  static async loadById(id) {
    return Ajax.get(`/projects/${id}`);
  }

  static async loadAll() {
    return Ajax.get('/projects');
  }

  static async create(project) {
    return Ajax.post('/projects', {
      body: project
    });
  }

  static async remove(id) {
    return Ajax.del(`/projects/${id}`);
  }
}
