import React from 'react';
import { array, func } from 'prop-types';
import { Button, Card, Dropdown, Icon, Input, Menu, Tree } from 'antd';
const Search = Input.Search;
const InputGroup = Input.Group;
const TreeNode = Tree.TreeNode;


export default class ProjectsMenu extends React.Component {
  static propTypes = {
    projects: array.isRequired,
    onProjectCreateClicked:func.isRequired, 
    onProjectDeleted:func.isRequired, 
    onProjectEditClicked: func.isRequired,
    onProjectSelectClicked:func.isRequired, 
    onApiCreateClicked: func.isRequired,
    onApiEditClicked: func.isRequired,
    onApiSelectClicked: func.isRequired,
  }

  constructor(props) {
    super(props);
    // this.state = {
    //   projects: [],
    //   expandedKeys: []
    // }
    // this.loadData();
  }

  // async loadData() {
  //   let data = await Ajax.get('/projects');
  //   this.setState({
  //     projects: data.data,
  //     expandedKeys: data.data.map(project => `project-${project.id.toString()}`)
  //   });
  // }

  onCreate = ({key}) => {
    if (key === 'project') {
      this.props.onProjectCreateClicked();
    } else {
      this.props.onApiCreateClicked();
    }
  }

  onSelect = (selectedKeys, info) => {
    let selectedKey = selectedKeys[0];
    if (!selectedKey) {
      return;
    }
    let splitArr = selectedKey.split('-');
    let type = splitArr[0];
    let id = splitArr[1];
    if (type === 'project') {
      this.props.onProjectSelectClicked(id);
    } else {
      this.props.onApiSelectClicked(id);
    }
  }

  render() {
    const projects = this.props.projects;
    const expandedKeys = projects.map(project => `project-${project.id.toString()}`);

    const menu = (
      <Menu onClick={this.onCreate}>
        <Menu.Item key="api"><Icon type="file-add" /> 新建接口</Menu.Item>
        <Menu.Item key="project"><Icon type="folder-add" /> 新建项目</Menu.Item>
      </Menu>
    );
    const dropdown = (
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="extra-btn"><Icon type="plus-circle-o" /></a>
      </Dropdown>
    );

    return (
      <div className="component-projects-menu">
        <Card title="接口管理" extra={dropdown}>
          {/*<Search />*/}
          <Tree
            showLine
            expandedKeys={expandedKeys}
            onSelect={this.onSelect}
          >
            {projects.map(project => {
              return <TreeNode title={project.name} key={`project-${project.id}`}>
                {project.apis.map(api => {
                  return <TreeNode title={`${api.path} ${api.method}`} key={`api-${api.id}`} />
                })}
              </TreeNode>
            })}
          </Tree>
        </Card>
      </div>
    );
  }
}