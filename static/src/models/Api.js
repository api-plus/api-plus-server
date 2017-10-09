import { observable } from 'mobx';
import Ajax from '../components/ajax';

export default class Api {
  id;
  @observable path;
  @observable method;
  @observable description;
  @observable project_id;
  @observable produces;
  @observable consumes;
  @observable scheme;
  @observable parameters;
  @observable response;
  @observable gmt_create;
  @observable gmt_modified;

  constructor(api) {
    const { id, 
      path, 
      method, 
      description, 
      project_id, 
      produces, 
      consumes, 
      scheme,
      parameters,
      response,
      gmt_create,
      gmt_modified,
    } = api;

    this.id = id || Date.now();
    this.path = path;
    this.method = method;
    this.description = description;
    this.project_id = project_id;
    this.produces = produces;
    this.consumes = consumes;
    this.scheme = scheme;
    this.parameters = parameters;
    this.response = response;
    this.gmt_create = gmt_create;
    this.gmt_modified = gmt_modified;
  }

  static async load(id) {
    const { data } = await Ajax.get(`/apis/${id}`);
    return new Api(data);
  }
}
