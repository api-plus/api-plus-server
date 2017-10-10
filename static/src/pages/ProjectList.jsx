import React from 'react';
import { array, func } from 'prop-types';
import { inject, observer } from "mobx-react";
import { Link } from 'react-router-dom';
import { Button, Card, Dropdown, Icon, Input, Menu, Tag, Tree } from 'antd';
const Search = Input.Search;
const InputGroup = Input.Group;
const TreeNode = Tree.TreeNode;

import './ProjectList.less';

@inject('projectListStore') @observer
export default class ProjectsList extends React.Component {

  handleSelect = (selectedKeys, info) => {
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

  handleExpand = (expandedKeys) => {
    let expandedKey = expandedKeys.pop();
    if (!expandedKey) {
      return;
    }
    let splitArr = expandedKey.split('-');
    let type = splitArr[0];
    let id = splitArr[1];
    if (type === 'project') {
      location.hash = `/project/${id}`;
    } else {
      location.hash = `/api/${id}`;
    }
  }

  render() {
    const { projects, project, api } = this.props.projectListStore;
    const selectedKey = api.id ? `api-${api.id}` : `project-${project.id}`;
    const expandedKey = selectedKey;

    const menu = (
      <Menu>
        <Menu.Item key="api">
          <Link to="/create/api"><Icon type="file-add" /> 新建接口</Link>
        </Menu.Item>
        <Menu.Item key="project">
          <Link to="/create/project"><Icon type="folder-add" /> 新建项目</Link>
        </Menu.Item>
      </Menu>
    );
    const dropdown = (
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="extra-btn"><Icon type="plus-circle-o" /></a>
      </Dropdown>
    );

    return (
      <div className="component-projects-list">
        <Card title="接口管理" extra={dropdown}>
          {/*<Search />*/}
          <Tree
            className="projects-tree"
            onSelect={this.handleSelect}
            onExpand={this.handleExpand}
            selectedKeys={[selectedKey]}
            expandedKeys={[expandedKey]}
          >
            {projects.map(project => {
              return <TreeNode title={<span className="project-title">{project.name}</span>} key={`project-${project.id}`}>
                {project.apis.map(api => {
                  let color = 'green';
                  if (api.method === 'GET') {
                    color = 'green';
                  } else if (api.method === 'POST') {
                    color = 'blue';
                  } else if (api.method === 'PUT') {
                    color = 'orange';
                  } else if (api.method === 'DELETE') {
                    color = 'red';
                  }
                  return (
                    <TreeNode 
                      title={
                        <span>
                          <Tag color={color}>{api.method}</Tag>
                          <span className="api-path">{api.path}</span>
                        </span>
                      } 
                      key={`api-${api.id}`} 
                    />
                  )
                })}
              </TreeNode>
            })}
          </Tree>
        </Card>
      </div>
    );
  }
}