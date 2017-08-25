import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Card, Col, Icon } from 'antd';

import Ajax from '../components/ajax';
import Layout from '../components/layout';
import ProjectsMenu from './ProjectsMenu';
import ProjectCreate from './ProjectCreate';
import ProjectUpdate from './ProjectUpdate';
import ProjectDocs from './ProjectDocs';
import ApiCreate from './ApiCreate';
import ApiUpdate from './ApiUpdate';
import ApiDocs from './ApiDocs';

import './index.less';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      projects: [], // 指定左侧接口管理的数据
      component: 'apiCreate', // 指定右侧加载的组件类型
      currentApiId: null,
      currentProjectId: null,
    }
    this.loadProjects();
  }

  async loadProjects() {
    let data = await Ajax.get('/projects');
    this.setState({
      projects: data.data,
    });
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
    let projects = [...this.state.projects];
    projects.forEach(p => {
      p.apis = p.apis.filter(api => {
        return api.id.toString() !== id
      });
    });
    
    this.setState({
      projects,
      component: null,
      currentApiId: null
    });
  }

  onApiCreated = (projectId, api) => {
    let projects = [...this.state.projects];
    projects.forEach(p => {
      if (p.id.toString() === projectId) {
        p.apis.push(api);
      }
    });
    this.setState({ 
      projects,
      currentApiId: api.id.toString(),
      component: 'apiDocs'
    });
  }
  onProjectCreated = (project) => {
    console.log('created project:', project);
  }

	render() {
    let { projects, component, currentApiId, currentProjectId } = this.state;
    
		return (
			<Layout selected="0" >
        <Row gutter={10}>
          <Col span={6}>
            <ProjectsMenu 
              projects={this.state.projects}
              onProjectCreateClicked={this.onShowProjectCreate}
              onProjectDeleted={this.onProjectDeleted}
              onProjectEditClicked={this.onShowProjectEdit}
              onProjectSelectClicked={this.onShowProjectDocs}
              onApiCreateClicked={this.onShowApiCreate}
              onApiEditClicked={this.onShowApiEdit}
              onApiSelectClicked={this.onShowApiDocs}
            />
          </Col>
          <Col span={18}>
            {(component === 'apiDocs') && <ApiDocs onApiDeleted={this.onApiDeleted} id={currentApiId}/>}
            {(component === 'apiCreate') && <ApiCreate onApiCreated={this.onApiCreated} projects={projects}/>}
            {(component === 'apiUpdate') && <ApiUpdate id={currentApiId} />}
            {(component === 'projectDocs') && <ProjectDocs id={currentProjectId} />}
            {(component === 'projectCreate') && <ProjectCreate onProjectCreated={this.onProjectCreated}/>}
            {(component === 'projectUpdate') && <ProjectUpdate id={currentProjectId} />}
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