import React from 'react';
import { Card, Icon, Popconfirm } from 'antd';
import { inject, observer } from 'mobx-react';
import { func, string } from 'prop-types';

import Api from '../models/Api';
import Project from '../models/Project';
import Ajax from '../components/ajax';
import Previewer from '../components/schema/Previewer';

import './ApiDetail.less'

@inject('projectListStore') @observer
class ApiDetail extends React.Component {
  static propTypes = {
    id: string.isRequired
  }

  componentDidMount() {
    this.loadApi(this.props.id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.id !== this.props.id) {
      this.loadApi(newProps.id);
    }
  }

  async loadApi(id) {
    const apiRes = await Api.load(id);
    const api = new Api(apiRes.data);
    const projectRes = await Project.loadById(api.project_id);
    const project = new Project(projectRes.data);

    this.props.projectListStore.setApi(api);
    this.props.projectListStore.setProject(project);
  }

  render() {
    const api = this.props.projectListStore.api;

    return (
      <div className="component-api-detail">
        <h2>{api.path}</h2>
        <p>{api.description}</p>
        <h3>基本信息</h3>
        <p>请求方式：{api.method}，协议类型：{api.scheme}，数据格式：{api.consumes}</p>
        {api.parameters && <h3>请求参数</h3>}
        <Previewer schema={api.parameters || {}} format="table" type="request" />
        {api.response && <h3>返回格式</h3>}
        <Previewer schema={api.response || {}} format="table" type="response" />
      </div>
    );
  }
}

@inject('projectListStore') @observer
class ApiCard extends React.Component {


  handleDeleteClick = async () => {
    const apiId = this.props.projectListStore.api.id;
    const projectId = this.props.projectListStore.project.id;
    const { code } = await Api.remove(apiId);
    this.props.projectListStore.removeApi(apiId);
    location.hash = `/project/${projectId}`;
  }
  handleUpdateClick = () => {
    const apiId = this.props.projectListStore.api.id;
    location.hash = `/update/api/${apiId}`;
  }

  render() {
    const extra = (
      <div>
        <a className="extra-btn" onClick={this.handleUpdateClick}><Icon type="edit" /> 编辑</a>
        <Popconfirm placement="left" title="确定删除吗？" onConfirm={this.handleDeleteClick}>
          <a className="extra-btn"><Icon type="delete" /> 删除</a>
        </Popconfirm>
      </div>
    );

    const apiId = this.props.match.params.id;

    return (
      <div className="component-api-card">
        <Card title="接口文档" extra={extra}>
          <ApiDetail id={apiId} />
        </Card>   
      </div>
    );
  }
}

ApiCard.ApiDetail = ApiDetail;
export default ApiCard;