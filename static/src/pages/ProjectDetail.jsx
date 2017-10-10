import React from 'react';
import { Card, Icon, Popconfirm } from 'antd';
import { inject, observer } from 'mobx-react';

import Project from '../models/Project';
import './ProjectDetail.less';

@inject('projectListStore') @observer
export default class ProcjectDetail extends React.Component {

  componentDidMount() {
    this.loadProject(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.id !== this.props.match.params.id) {
      this.loadProject(newProps.match.params.id);
    }
  }

  async loadProject(id) {
    const { data } = await Project.loadById(id);
    this.props.projectListStore.setProject(new Project(data));
    this.props.projectListStore.setApi({});
  }


  handleDeleteClick = async () => {
    const { project, projects } = this.props.projectListStore;
    const { code } = await Project.remove(project.id);
    this.props.projectListStore.removeProject(project.id);
    if (projects.length) {
      location.hash = `/project/${projects[0].id}`;
    } else {
      location.hash = '';
    }
  }
  handleUpdateClick = () => {
    const projectId = this.props.projectListStore.project.id;
    location.hash = `/update/project/${projectId}`;
  }

  render() {
    const extra = (
      <div>
        <a className="extra-btn" onClick={this.handleUpdateClick}><Icon type="edit" /></a>
        <Popconfirm placement="left" title="确定删除吗？" onConfirm={this.handleDeleteClick}>
          <a className="extra-btn"><Icon type="delete" /></a>
        </Popconfirm>
      </div>
    );

    const project = this.props.projectListStore.project;

    return (
      <div className="component-project-detail">
        <Card title="项目信息" extra={extra}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <h3>环境</h3>
          <p>线上环境：{project.production || '无'}，测试环境：{project.testing || '无'}，开发环境：{project.development || '无'}</p>
          {/*{project.apis && project.apis.map(api => {
            return <ApiDocs key={api.id.toString()} id={api.id.toString()} onApiDeleted={() => {}} />
          })}*/}
        </Card>
      </div>
    );
  }
}