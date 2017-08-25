
import React from 'react';
import { Card } from 'antd';
import { string } from 'prop-types';

import Apis from '../components/models/Apis';

const PropTypes = {
  id: string.isRequired
}

export default class ApisDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: {}
    }
    this.apis = new Apis();
    this.loadData(props.id);
  }

  async loadData(id) {
    let api = await this.apis.get(id);
    this.setState({ api });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.loadData(nextProps.id);
    }
  }

  render() {
    const api = this.state.api;
    return <div>
      <Card title="接口文档">
        <h2>{api.path}</h2>
        <p>{api.description}</p>
        <h3>请求方式</h3>
        <p>{JSON.stringify(api.method)}</p>
        <h3>请求参数</h3>
        <p>{JSON.stringify(api.parameters)}</p>
        <h3>返回内容</h3>
        <p>{JSON.stringify(api.responses)}</p>
      </Card>   
    </div>;
  }
}

ApisDocs.propTypes = PropTypes;