import React from 'react';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;

import '../iconfont';
import './index.less';

export default class Homepage extends React.Component {

  render() {
    return (
      <Layout>
        <Header className="layout-header">
          <div className="layout-brand"><a href="#/"></a></div>
        </Header>
        <Content className="layout-content layout-centent-home">
          {this.props.children}
        </Content>
        <Footer className="layout-footer">
          <ul>
            <li>Enjoy Api Documents</li>
          </ul>
        </Footer>
      </Layout>
    );
  }
}