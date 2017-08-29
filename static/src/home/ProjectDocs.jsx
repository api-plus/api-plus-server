
import React from 'react';
import { Card } from 'antd';
import { string } from 'prop-types';

import projects from '../components/models/Projects';
import { ApiDocs } from './ApiDocs';

const PropTypes = {
  id: string.isRequired
}

export default class ProcjectDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {}
    }
    this.loadData(props.id);
  }

  async loadData(id) {
    let project = await projects.get(id);
    this.setState({ project });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.loadData(nextProps.id);
    }
  }

  render() {
    const project = this.state.project;
    return <div className="component-project-docs">
      <Card title="项目信息">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <h3>环境</h3>
        <p>线上环境：{project.production || '无'}，测试环境：{project.testing || '无'}，开发环境：{project.development || '无'}</p>
        {/*{project.apis && project.apis.map(api => {
          return <ApiDocs key={api.id.toString()} id={api.id.toString()} onApiDeleted={() => {}} />
        })}*/}
      </Card>
    </div>;
  }
}

ProcjectDocs.propTypes = PropTypes;