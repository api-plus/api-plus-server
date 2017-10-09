import React from 'react';
import { array, func } from 'prop-types';
import { observer } from "mobx-react";
import { Button, Card, Dropdown, Icon, Input, Menu, Tree } from 'antd';
const Search = Input.Search;
const InputGroup = Input.Group;
const TreeNode = Tree.TreeNode;
import { Link } from 'react-router-dom';

import projectListStore from '../models/ProjectList';

@observer
export default class ProjectsList extends React.Component {

  onSelect = (selectedKeys, info) => {
    let selectedKey = selectedKeys[0];
    if (!selectedKey) {
      return;
    }
    let splitArr = selectedKey.split('-');
    let type = splitArr[0];
    let id = splitArr[1];
    if (type === 'project') {
      location.hash = `/project/${id}`;
    } else {
      location.hash = `/api/${id}`;
    }
  }

  render() {
    const projects = projectListStore.projects;

    const menu = (
      <Menu>
        <Menu.Item key="api">
          <Link to="/api/create"><Icon type="file-add" /> 新建接口</Link>
        </Menu.Item>
        <Menu.Item key="project">
          <Link to="/project/create"><Icon type="folder-add" /> 新建项目</Link>
        </Menu.Item>
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