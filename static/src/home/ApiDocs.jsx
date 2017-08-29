
import React from 'react';
import { Card, Icon, Popconfirm } from 'antd';
import { func, string } from 'prop-types';

import apis from '../components/models/Apis';
import Ajax from '../components/ajax';
import Previewer from '../components/schema/Previewer';

import './ApiDocs.less'

const PropTypes = {
  id: string.isRequired,
  onApiDeleted: func.isRequired,
}

class ApiDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: {}
    }
    this.loadData(props.id);
  }

  async loadData(id) {
    let api = await apis.get(id);
    this.setState({ api });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.loadData(nextProps.id);
    }
  }

  render() {
    const api = this.state.api;

    return <div className="component-api-docs">
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

ApiDocs.propTypes = PropTypes;

class ApiCard extends React.Component {
  onDeleteClicked = () => {
    Ajax.del('/apis/' + this.props.id)
    .then((data) => {
      this.props.onApiDeleted(this.props.id);
    });
  }

  render() {
    const popConfirm = (
      <Popconfirm placement="left" title="确定删除吗？" onConfirm={this.onDeleteClicked}>
        <Icon type="delete" />
      </Popconfirm>
    );

    return <div>
      <Card title="接口文档" extra={popConfirm}>
        <ApiDocs {...this.props} />
      </Card>   
    </div>;
  }
}
ApiCard.ApiDocs = ApiDocs;
export default ApiCard;