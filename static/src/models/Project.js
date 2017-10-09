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

  static async load(id) {
    const { data } = await Ajax.get(`/projects/${id}`);
    return new Project(data);
  }
}
