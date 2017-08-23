import './index.less';
import React from 'react';
import Cookies from 'js-cookie';
import { string } from 'prop-types';
import '~/components/iconfont';
import Ajax from '~/components/ajax';
import { Layout, Menu, Dropdown, Icon, Button, Modal, Popover } from 'antd';
const { Header, Content, Footer } = Layout;
const confirm = Modal.confirm;

export default class Homepage extends React.Component {
  static propTypes = {
    selected: string // 选中的菜单项，下标从 1 开始
  }

  static defaultProps = {
    selected: "1"
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      menuAttr: "horizontal",
      menuClassName: 'layout-menu'
    };
  }
  componentWillMount() {
    this.isLoggedIn();
  }

  // 退出登录的二次确认
  logoutConfirm = () => {
    confirm({
      title: '您确定要退出吗？',
      onOk() {
        Ajax.post('/entry/logout')
        .then(data => {
          Cookies.remove('userName');
          Cookies.remove('role');
          Cookies.remove('Authorization');
          window.location.href = '../home/index.html';
        });
      },
      onCancel() {
      }
    });
  }
  // 判断是否已登录
  isLoggedIn() {
    // return Cookies.get('Authorization');
    return false;
  }

  // home 页不显示导航条
  hasMenu = () => {
    return this.props.selected !== '0';
  }

  render() {
    const personalMenu = (
      <Menu>
        <Menu.Item key="1">
          <a href="javascript:void(0)" onClick={this.logoutConfirm}>退出登录</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout>
        <Header className="layout-header">
          <div className="layout-brand"><a href="../home/index.html"></a></div>
          {this.isLoggedIn() && (
          <div>
            <div className="layout-login">
              <Icon className="layout-login-icon" type="user" />
              <Dropdown overlay={personalMenu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  {Cookies.get('userName')} <Icon type="down" />
                </a>
              </Dropdown>
            </div>
            {this.hasMenu() && (
            <div>
              <TopMenu isSmall={false} selected={this.props.selected}/>
              <Dropdown
                overlay={<TopMenu isSmall={true}
                selected={this.props.selected}/>}
                trigger={['click']}
                placement="bottomLeft"
              >
                <i className="navbar-toggle"></i>
              </Dropdown>
            </div>
            )}
          </div>)}
          {this.isLoggedIn() || <div className="layout-login">
            {/*<a href="../login/index.html">登录</a>*/}
          </div>}
        </Header>
        <Content className="layout-content layout-centent-home">
          {this.props.children}
        </Content>
        <Footer className="layout-footer">
          <ul>
            <li>万达网络科技集团 | 版权所有 | 关于我们</li>
            <li>Copyright &copy; Wanda. All Rights Reserved</li>
          </ul>
        </Footer>
      </Layout>
    );
  }
}
/* 顶部导航条 */
class TopMenu extends React.Component {
  render() {
    return (
      <Menu
        className={this.props.isSmall ? "layout-menu-dropdown" : "layout-menu"}
        mode={this.props.isSmall ? "vertical" : "horizontal"}
        selectedKeys={[this.props.selected]}
      >
        <Menu.Item key="1"><a href="../index/index.html">首页</a></Menu.Item>
      </Menu>
    );
  }
}