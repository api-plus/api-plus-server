import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { Col, Row } from 'antd';

import AppLayout from '../components/layout';
import ProjectCreate from './ProjectCreate';
import ProjectDetail from './ProjectDetail';
import ProjectList from './ProjectList';
import ApiCreate from './ApiCreate';
import ApiDetail from './ApiDetail';

class Home extends React.Component {
  render() {
    return (
      <span>Home</span>
    )
  }
}

ReactDOM.render(
  <HashRouter>
    <AppLayout>
      <Row gutter={10}>
        <Col span={6}>
          <ProjectList />
        </Col>
        <Col span={18}>
          <Route exact path="/" component={Home}/>
          <Route path="/project/create" component={ProjectCreate}/>
          <Route path="/project/:id" component={ProjectDetail}/>
          <Route path="/api/create" component={ApiCreate}/>
          <Route path="/api/:id" component={ApiDetail}/>
        </Col>
      </Row>
    </AppLayout>
  </HashRouter>, 
  document.getElementById('root')
);

// 支持热替换
if (module.hot) {
  module.hot.accept();
}