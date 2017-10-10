
import { observable, action } from 'mobx';

import Ajax from '../components/ajax';
import Project from "./Project";


export default class ProjectList {
  @observable projects = [];
  @observable project = {}; // 当前选中的 project
  @observable api = {}; // 当前选中的 api

  constructor() {
    this.loadProjects();
  }

  getProject(projectId) {
    return this.projects.find(project => project.id === projectId);
  }

  @action
  async loadProjects() {
    const { data } = await Project.loadAll();
    this.projects = data.map(project => new Project(project));
  }

  @action
  addProject(project) {
    this.projects.push(project);
  }

  @action
  addApi(api) {
    const project = this.getProject(parseInt(api.project_id));
    project.apis.push(api);
  }

  @action
  removeApi(id) {
    this.projects.forEach(project => {
      let apiIndex = project.apis.findIndex(api => api.id === parseInt(id));
      if (apiIndex !== -1) {
        project.apis.splice(apiIndex, 1);
      }
    });
  }

  @action
  removeProject(id) {
    let index = this.projects.findIndex(project => project.id === parseInt(id));
    if (index !== -1) {
      this.projects.splice(index, 1);
    }
  }

  @action
  setApi(api) {
    if (this.api.id === api.id) return;
    this.api = api;
  }

  @action
  setProject(project) {
    if (this.project.id === project.id) return;
    this.project = project;
  }
}