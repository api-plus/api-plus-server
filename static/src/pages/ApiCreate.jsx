
// TODO 
// 1. loading 状态
// 2. 请求失败的提示

/* third party modules */
import React from 'react';
import { func, array } from 'prop-types';
import { inject, observer } from "mobx-react";
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

/* internal modules */
import Ajax from '../components/ajax';
import SchemaEditor from '../components/schema/Editor';
import Api from '../models/Api';

/* component */
@inject('projectListStore') @observer
export default class ApiCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  onSave = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      
      Object.assign(values, {
        parameters: this.parametersEditor.get(),
        response: this.responsesEditor.get()
      });

      Api.create(values)
      .then(({ code, data }) => {
        this.props.projectListStore.addApi(new Api(data));
        location.hash = `/api/${data.id}`;
      });
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }
  saveParametersRef = (parameters) => {
    this.parametersEditor = parameters;
  }
  saveResponsesRef = (responses) => {
    this.responsesEditor = responses;
  }

  render() {
    const projects = this.props.projectListStore.projects;
    const singleItemLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    return (
      <div>
        <Card title="新建接口">
          <h3>基本信息</h3>
          <WrappedApiForm ref={this.saveFormRef} projects={projects} />
          <h3>请求参数</h3>
          <SchemaEditor 
            ref={this.saveParametersRef}
            showPreviewer={false}
            showAddParamBtn={true}
            schemaType="request"
          />
          <h3>返回格式</h3>
          <SchemaEditor ref={this.saveResponsesRef} showImport={true} />
          <br />
          <Button type="primary" size="large" onClick={this.onSave}>保存</Button>
        </Card>
      </div>
    );
  }
}

class ApiForm extends React.Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const { projects } = this.props;
    const singleItemLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const twoItemLayout =  {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const threeItemLayout =  {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <Form layout="horizontal">
        <FormItem {...singleItemLayout} label="项目">
          {getFieldDecorator('project_id', {
            rules: [{ required: true,  message: '请选择项目' }]
          })(
            <Select>
              {projects.map(p => <Option key={p.id.toString()}>{p.name}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem {...singleItemLayout} label="路径">
          {getFieldDecorator('path',{
            rules: [{ required: true,  message: '请输入接口的路径地址' }]
          })(
            <Input placeholder="路径地址" />
          )}
        </FormItem>
        <FormItem {...singleItemLayout} label="说明">
          {getFieldDecorator('description',{
            rules: [{ required: true,  message: '请输入接口说明' }]
          })(
            <TextArea placeholder="接口说明" autosize={{ minRows: 2, maxRows: 6 }} />
          )}
        </FormItem>
        <Row>
          <Col span={8}>
            <FormItem {...threeItemLayout} label="方法">
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
          </Col>
          <Col span={8}>
            <FormItem {...threeItemLayout} label="协议">
              {getFieldDecorator('scheme', {
                initialValue: 'http'
              })(
                <Select>
                  <Option key="http">HTTP</Option>
                  <Option key="https">HTTPS</Option>
                  <Option key="websocket">Web Socket</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...threeItemLayout} label="响应格式">
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
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedApiForm = Form.create()(ApiForm);
