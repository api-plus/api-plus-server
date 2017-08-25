import './index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Card, Col, Icon } from 'antd';

import Layout from '../components/layout';
import ProjectsMenu from './projectsMenu';
import ProjectsCreate from './projectsCreate';
import ProjectsUpdate from './projectsUpdate';
import ProjectsDocs from './projectsDocs';
import ApisCreate from './apisCreate';
import ApisUpdate from './apisUpdate';
import ApisDocs from './apisDocs';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      component: null, // 指定右侧加载的组件类型
      currentApiId: null,
      currentProjectId: null,
    }
  }

  onShowProjectCreate = () => {
    this.setState({
      component: 'projectCreate',
      currentProjectId: null
    });
  }
  onShowProjectEdit = (id) => {
    this.setState({
      component: 'projectUpdate',
      currentProjectId: id
    });
  }
  onShowProjectDocs = (id) => {
    this.setState({
      component: 'projectDocs',
      currentProjectId: id
    });
  }
  onProjectDeleted = (id) => {
    this.setState({
      component: null,
      currentProjectId: null
    });
  }
  onShowApiCreate = () => {
    this.setState({
      component: 'apiCreate',
      currentApiId: null
    });
  }
  onShowApiEdit = (id) => {
    this.setState({
      component: 'apiUpdate',
      currentApiId: id
    });
  }
  onShowApiDocs = (id) => {
    this.setState({
      component: 'apiDocs',
      currentApiId: id
    });
  }
  onApiDeleted = (id) => {
    this.setState({
      component: null,
      currentApiId: null
    });
  }

  onApisCreated = (api) => {
    console.log('created api:', api);
  }
  onProjectsCreated = (project) => {
    console.log('created project:', project);
  }

	render() {
    let { component, currentApiId, currentProjectId } = this.state;
    
		return (
			<Layout selected="0" >
        <Row gutter={10}>
          <Col span={6}>
            <ProjectsMenu 
              onProjectCreateClicked={this.onShowProjectCreate}
              onProjectDeleted={this.onProjectDeleted}
              onProjectEditClicked={this.onShowProjectEdit}
              onProjectSelectClicked={this.onShowProjectDocs}
              onApiCreateClicked={this.onShowApiCreate}
              onApiDeleted={this.onApiDeleted}
              onApiEditClicked={this.onShowApiEdit}
              onApiSelectClicked={this.onShowApiDocs}
            />
          </Col>
          <Col span={18}>
            {(component === 'apiDocs') && <ApisDocs id={currentApiId} />}
            {(component === 'apiCreate') && <ApisCreate onApisCreated={this.onApisCreated}/>}
            {(component === 'apiUpdate') && <ApisUpdate id={currentApiId} />}
            {(component === 'projectDocs') && <ProjectsDocs />}
            {(component === 'projectCreate') && <ProjectsCreate onProjectsCreated={this.onProjectsCreated}/>}
            {(component === 'projectUpdate') && <ProjectsUpdate id={currentProjectId} />}
            {(component === null) && <Card className="empty-card">Empty</Card>}
          </Col>
        </Row>
        
			</Layout>
		);
	}
}

ReactDOM.render(
	<Home />,
	document.getElementById('root')
);
// 支持热替换
if (module.hot) {
  module.hot.accept();
}