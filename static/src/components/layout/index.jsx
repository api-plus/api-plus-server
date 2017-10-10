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
            <li>万达网络科技集团 - 大数据中心 - 数据工程部</li>
            <li>Copyright &copy; Wanda. All Rights Reserved</li>
          </ul>
        </Footer>
      </Layout>
    );
  }
}