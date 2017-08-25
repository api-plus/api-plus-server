
// TODO 
// 1. loading 状态
// 2. 请求失败的提示

/* third party modules */
import React from 'react';
import { func, array } from 'prop-types';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

/* internal modules */
import Ajax from '../components/ajax';

/* styles */

/* proptypes */
const PropTypes = {
  onApiCreated: func.isRequired,
  projects: array.isRequired
}

/* component */
export default class ApiCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  onSave = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { project_id, path, description, method, scheme, consumes } = values;
      Ajax.post('/apis', {
        body: {
          project_id, path, description, method, scheme, consumes
        }
      }).then((data) => {
        this.props.onApiCreated(project_id, data.data);
      });
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    return <div>
      <Card title="新建接口">
        <WrappedApiForm ref={this.saveFormRef} projects={this.props.projects} />
        <br />
        <Button type="primary" size="large" onClick={this.onSave}>保存</Button>
      </Card>
    </div>
  }
}
ApiCreate.propTypes = PropTypes;

class ApiForm extends React.Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const { projects } = this.props;
    const itemLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    return <Form layout="horizontal">
      <FormItem {...itemLayout} label="项目">
        {getFieldDecorator('project_id', {
          rules: [{ required: true,  message: '请选择项目' }]
        })(
          <Select>
            {projects.map(p => <Option key={p.id.toString()}>{p.name}</Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem {...itemLayout} label="Path">
        {getFieldDecorator('path',{
          rules: [{ required: true,  message: '请输入接口的路径地址' }]
        })(
          <Input placeholder="路径地址" />
        )}
      </FormItem>
      <FormItem {...itemLayout} label="说明">
        {getFieldDecorator('description',{
          rules: [{ required: true,  message: '请输入接口说明' }]
        })(
          <TextArea placeholder="接口说明" autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>
      <FormItem {...itemLayout} label="方法">
        {getFieldDecorator('method', {
          initialValue: 'GET'
        })(
          <Select>
            <Option key="GET">GET</Option>
            <Option key="POST">POST</Option>
            <Option key="PUT">PUT</Option>
            <Option key="DELETE">DELETE</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...itemLayout} label="协议">
        {getFieldDecorator('scheme', {
          initialValue: 'http'
        })(
          <Select>
            <Option key="http">http</Option>
            <Option key="https">https</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...itemLayout} label="数据格式">
        {getFieldDecorator('consumes', {
          initialValue: 'json'
        })(
          <Select>
            <Option key="json">json</Option>
            <Option key="text">text</Option>
            <Option key="html">html</Option>
            <Option key="jsonp">jsonp</Option>
          </Select>
        )}
      </FormItem>
    </Form>;
  }
}

const WrappedApiForm = Form.create()(ApiForm);
