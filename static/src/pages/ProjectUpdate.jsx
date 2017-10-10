
// TODO 
// 1. loading 状态
// 2. 请求失败的提示

/* third party modules */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

/* internal modules */
import Api from '../models/Api';
import Project from '../models/Project';
import Ajax from '../components/ajax';
import SchemaEditor from '../components/schema/Editor';

/* component */
@inject('projectListStore') @observer
export default class ProjectUpdate extends React.Component {


  componentDidMount() {
    this.loadProject(this.props.match.params.id);
  }

  async loadProject(id) {
    const projectRes = await Project.loadById(id);
    const project = new Project(projectRes.data);
    this.props.projectListStore.setProject(project);
    this.props.projectListStore.setApi({});
  }

  onSave = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // let { project_id, path, description, method, scheme, consumes } = values;

      const projectId = this.props.projectListStore.project.id;
      values.id = projectId;
      Project.update(values).then((data) => {
        location.hash = `/project/${projectId}`;
      });
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    const singleItemLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    const { project } = this.props.projectListStore;
    return <div>
      <Card title="编辑项目">
        <WrappedProjectForm ref={this.saveFormRef} project={project} />
        <br />
        <Button type="primary" size="large" onClick={this.onSave}>保存</Button>
      </Card>
    </div>
  }
}

class ProjectForm extends React.Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const project = this.props.project;
    const itemLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    if (project && project.id) {
      return (
        <Form>
          <FormItem {...itemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [{ required: true,  message: '请输入项目名称' }],
              initialValue: project.name
            })(
              <Input placeholder="项目名称" />
            )}
          </FormItem>
          <FormItem {...itemLayout} label="说明">
            {getFieldDecorator('description', {
              rules: [{ required: true,  message: '请输入项目说明' }],
              initialValue: project.description
            })(
              <TextArea placeholder="项目说明" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
          <FormItem {...itemLayout} label="线上环境">
            {getFieldDecorator('production', {
              initialValue: project.production
            })(
              <Input placeholder="线上环境地址，如 http://{host}:{port}" />
            )}
          </FormItem>
          <FormItem {...itemLayout} label="测试环境">
            {getFieldDecorator('testing', {
              initialValue: project.testing
            })(
              <Input placeholder="测试环境地址，如 http://{host}:{port}" />
            )}
          </FormItem>
          <FormItem {...itemLayout} label="开发环境">
            {getFieldDecorator('development', {
              initialValue: project.development
            })(
              <Input placeholder="开发环境地址，如 http://{host}:{port}" />
            )}
          </FormItem>
        </Form>
      );
    } else {
      return (<div>loading</div>);
    }
  }

  
}

const WrappedProjectForm = Form.create()(ProjectForm);
