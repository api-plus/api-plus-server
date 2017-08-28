
import React from 'react';
import { Card, Icon, Popconfirm } from 'antd';
import { func, string } from 'prop-types';

import apis from '../components/models/Apis';
import Ajax from '../components/ajax';

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
        <p>请求方式：{api.method}，协议：{api.scheme}，数据格式：{api.consumes}</p>
        {api.parameters && api.parameters.length !== 0 && <h3>请求参数</h3>}
        <ul>
          {api.parameters && api.parameters.map(param => {
            return <li key={param.id}>
              <span className="parameter-name">{param.name}</span>
              <span className="parameter-type">{param.type}</span>
              <span className="parameter-required">必选: {param.required.toString()}</span>
              <span className="parameter-default">默认值: {param.default || '无' }</span>
              <span className="parameter-description">{param.description}</span>
            </li>
          })}
        </ul>
        {api.responses && api.responses.length !== 0 && <h3>返回格式</h3>}
        <ul>
          {api.responses && api.responses.map(res => {
            return <li key={res.id}>
              <span className="responses-name">{res.name}</span>
              <span className="responses-type">{res.type}</span>
              <span className="responses-description">{res.description}</span>
            </li>
          })}
        </ul>
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