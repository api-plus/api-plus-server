import { action, observable } from 'mobx';

export default class UI {
  @observable api = {};
  @observable project = {};

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