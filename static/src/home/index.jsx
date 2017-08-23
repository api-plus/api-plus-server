import './index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col } from 'antd';

import Layout from '../components/layout';
import ProjectsMenu from './projectsMenu'

class Home extends React.Component {
	render() {
		return (
			<Layout selected="0" >
        <Row gutter={10}>
          <Col span={6}>
            <ProjectsMenu />
          </Col>
          <Col span={18}>
            right
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