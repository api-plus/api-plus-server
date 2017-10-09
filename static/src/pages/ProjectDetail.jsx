import React from 'react';
import { Card } from 'antd';
import { observer } from 'mobx-react';

import ProjectStore from '../models/Project';
import UIStore from '../models/UI';

@observer
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
    const project = await ProjectStore.load(id);
    UIStore.setProject(project);
  }

  render() {
    const project = UIStore.project;

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