
import { observable, action } from 'mobx';

import Ajax from '../components/ajax';
import Api from "./Api";
import Project from "./Project";


class ProjectList {
  @observable projects = [];

  constructor() {
    this.loadProjects();
  }

  @action
  async loadProjects() {
    const { data } = await Ajax.get('/projects');
    data.forEach(project => {
      this.projects.push(new Project(project));
    });
  }

  getProject(projectId) {
    return this.projects.find(project => project.id === projectId);
  }

  @action
  async createProject(project) {
    const { name, description, production, testing, development } = project;
    const { data } = await Ajax.post('/projects', {
      body: {
        name, description, production, testing, development
      }
    });
    this.projects.push(new Project(data));
    return data;
  }

  @action
  async createApi(api) {
    const { project_id, path, description, method, scheme, consumes, parameters, response } = api;
    const { data } = await Ajax.post('/apis', {
      body: api
    });
    this.getProject(parseInt(project_id)).apis.push(new Api(data));
    return data;
  }

  // @action
  // createApi(projectId, api) {
  //   this.getProject(projectId).api.push(new Api(api));
  // }
}

export default (new ProjectList());