// TODO 
// 1. loading 状态
// 2. 请求失败的提示

import React from 'react';
import { func } from 'prop-types';
import { Button, Card, Form, Input } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

import Ajax from '../components/ajax';
import projectListStore from '../models/ProjectList';

export default class ProjectCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  onSave = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      projectListStore.createProject(values)
      .then(project => {
        location.hash = `/project/${project.id}`;
      });
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    return <div>
      <Card title="新建项目">
        <WrappedProjectForm ref={this.saveFormRef}/>
        <br />
        <Button type="primary" size="large" onClick={this.onSave}>保存</Button>
      </Card>
    </div>
  }
}

class ProjectForm extends React.Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const itemLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    return <Form>
      <FormItem {...itemLayout} label="名称">
        {getFieldDecorator('name',{
          rules: [{ required: true,  message: '请输入项目名称' }]
        })(
          <Input placeholder="项目名称" />
        )}
      </FormItem>
      <FormItem {...itemLayout} label="说明">
        {getFieldDecorator('description',{
          rules: [{ required: true,  message: '请输入项目说明' }]
        })(
          <TextArea placeholder="项目说明" autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>
      <FormItem {...itemLayout} label="线上环境">
        {getFieldDecorator('production')(
          <Input placeholder="线上环境地址，如 http://{host}:{port}" />
        )}
      </FormItem>
      <FormItem {...itemLayout} label="测试环境">
        {getFieldDecorator('testing')(
          <Input placeholder="测试环境地址，如 http://{host}:{port}" />
        )}
      </FormItem>
      <FormItem {...itemLayout} label="开发环境">
        {getFieldDecorator('development')(
          <Input placeholder="开发环境地址，如 http://{host}:{port}" />
        )}
      </FormItem>
    </Form>;
  }
}

const WrappedProjectForm = Form.create()(ProjectForm);
