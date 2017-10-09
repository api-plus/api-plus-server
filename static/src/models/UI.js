import { action, observable } from 'mobx';

class UI {
  @observable api = {};
  @observable project = {};

  @action
  setApi(api) {
    this.api = api;
  }

  @action
  setProject(project) {
    this.project = project;
  }
}

export default (new UI());