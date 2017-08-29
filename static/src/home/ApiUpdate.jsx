
// TODO 
// 1. loading 状态
// 2. 请求失败的提示

/* third party modules */
import React from 'react';
import { func, array, string } from 'prop-types';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

/* internal modules */
import Ajax from '../components/ajax';
import SchemaEditor from '../components/schema/Editor';
import ParameterEditor from './ParameterEditor';

/* styles */

/* proptypes */
const PropTypes = {
  onApiUpdated: func.isRequired,
  projects: array.isRequired,
  id: string.isRequired
}

/* component */
export default class ApiUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: null
    };
    this.loadData(props.id);
  }

  async loadData(id) {
    let api = (await Ajax.get('/apis/' + id)).data;
    this.setState({ api });
  }

  onSave = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { project_id, path, description, method, scheme, consumes } = values;
      Ajax.put('/apis/' + this.props.id, {
        body: {
          project_id, path, description, method, scheme, consumes,
          parameters: this.parametersEditor.get(),
          response: this.responsesEditor.get()
        }
      }).then((data) => {
        this.props.onApiUpdated(project_id, data.data);
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
    const singleItemLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    const { api } = this.state;

    return <div>
      <Card title="新建接口">
        <h3>基本信息</h3>
        <WrappedApiForm ref={this.saveFormRef} projects={this.props.projects} api={api} />
        <h3>请求参数</h3>
        {/*<ParameterEditor ref={this.saveParametersRef} parameters={[]} />*/}
        {
          api && api.parameters && 
          <SchemaEditor 
            ref={this.saveParametersRef}
            showPreviewer={false}
            showAddParamBtn={true}
            schemaType="request"
            schema={api.parameters}
          />
        }
        <h3>返回格式</h3>
        {
          api && api.response && 
          <SchemaEditor ref={this.saveResponsesRef} schema={api.response} />
        }
        <br />
        <Button type="primary" size="large" onClick={this.onSave}>保存</Button>
      </Card>
    </div>
  }
}
ApiUpdate.propTypes = PropTypes;

class ApiForm extends React.Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const { projects, api } = this.props;
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

    if (api) {

    return <Form layout="horizontal">
      <FormItem {...singleItemLayout} label="项目">
        {getFieldDecorator('project_id', {
          rules: [{ required: true,  message: '请选择项目' }],
          initialValue: api.project_id.toString()
        })(
          <Select>
            {projects.map(p => <Option key={p.id.toString()}>{p.name}</Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem {...singleItemLayout} label="路径">
        {getFieldDecorator('path',{
          rules: [{ required: true,  message: '请输入接口的路径地址' }],
          initialValue: api.path
        })(
          <Input placeholder="路径地址" />
        )}
      </FormItem>
      <FormItem {...singleItemLayout} label="说明">
        {getFieldDecorator('description',{
          rules: [{ required: true,  message: '请输入接口说明' }],
          initialValue: api.description
        })(
          <TextArea placeholder="接口说明" autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>
      <Row>
        <Col span={8}>
          <FormItem {...threeItemLayout} label="方法">
            {getFieldDecorator('method', {
              initialValue: api.method
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
              initialValue: api.scheme
            })(
              <Select>
                <Option key="http">http</Option>
                <Option key="https">https</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...threeItemLayout} label="响应格式">
            {getFieldDecorator('consumes', {
              initialValue: api.consumes
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
    </Form>;
    } else {
      return <div>loading</div>
    }
  
  }
}

const WrappedApiForm = Form.create()(ApiForm);
