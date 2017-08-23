import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

import Ajax from '../components/ajax';

export default class ProjectsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      expandedKeys: []
    }
    this.loadData();
  }

  async loadData() {
    let data = await Ajax.get('/projects');
    this.setState({
      projects: data.data,
      expandedKeys: data.data.map(project => project.id.toString())
    });
  }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }
  render() {
    return (
      <div className="component-projects-menu">
        <Tree
          showLine
          expandedKeys={this.state.expandedKeys}
          onSelect={this.onSelect}
        >
          {this.state.projects.map(project => {
            return <TreeNode title={project.name} key={project.id}>
              {project.apis.map(api => {
                return <TreeNode title={api.path} key={api.id} />
              })}
            </TreeNode>
          })}
        </Tree>
      </div>
    );
  }
}