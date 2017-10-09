import React from 'react';
import { Card, Icon, Popconfirm } from 'antd';
import { observer } from 'mobx-react';
import { func, string } from 'prop-types';

import ApiStore from '../models/Api';
import UIStore from '../models/UI';
import Ajax from '../components/ajax';
import Previewer from '../components/schema/Previewer';

import './ApiDetail.less'

@observer
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
    const api = await ApiStore.load(id);
    UIStore.setApi(api);
  }

  render() {
    const api = UIStore.api;

    return <div className="component-api-detail">
        <h2>{api.path}</h2>
        <p>{api.description}</p>
        <h3>基本信息</h3>
        <p>请求方式：{api.method}，协议类型：{api.scheme}，数据格式：{api.consumes}</p>
        {api.parameters && <h3>请求参数</h3>}
        {/*<ul>
          {api.parameters && Object.entries(api.parameters).map(([key, value]) => {
            return <li key={key}>
              <span className="parameter-name">{key}</span>
              <span className="parameter-type">{value.type}</span>
              <span className="parameter-required">必选: {value.isRequired.toString()}</span>
              <span className="parameter-default">默认值: {value.default || '无' }</span>
              <span className="parameter-description">{value.description}</span>
            </li>
          })}
        </ul>*/}
        <Previewer schema={api.parameters || {}} format="table" type="request" />
        {api.response && <h3>返回格式</h3>}
        {/*<ul>
          {api.response && Object.entries(api.response).map(([key, value]) => {
            return <li key={key}>
              <span className="responses-name">{value.name}</span>
              <span className="responses-type">{value.type}</span>
              <span className="responses-description">{value.description}</span>
            </li>
          })}
        </ul>*/}
        <Previewer schema={api.response || {}} format="table" type="response" />
    </div>;
  }
}

class ApiCard extends React.Component {


  onDeleteClicked = () => {
    Ajax.del('/apis/' + this.props.id)
    .then((data) => {
      // this.props.onApiDeleted(this.props.id);
    });
  }
  onApiUpdateClicked = () => {
    // this.props.onApiUpdateClicked(this.props.id);
  }

  render() {
    const extra = (
      <div>
        <a className="extra-btn" onClick={this.onApiUpdateClicked}><Icon type="edit" /></a>
        <Popconfirm placement="left" title="确定删除吗？" onConfirm={this.onDeleteClicked}>
          <a className="extra-btn"><Icon type="delete" /></a>
        </Popconfirm>
      </div>
    );

    const apiId = this.props.match.params.id;

    return <div className="component-api-card">
      <Card title="接口文档" extra={extra}>
        <ApiDetail id={apiId} />
      </Card>   
    </div>;
  }
}
// ApiCard.ApiDocs = ApiDocs;
export default ApiCard;