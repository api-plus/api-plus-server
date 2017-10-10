
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
import ParameterEditor from '../home/ParameterEditor';

/* component */
@inject('projectListStore') @observer
export default class ApiUpdate extends React.Component {


  componentDidMount() {
    this.loadApi(this.props.match.params.id);
  }

  async loadApi(id) {
    const apiRes = await Api.load(id);
    const api = new Api(apiRes.data);
    const projectRes = await Project.loadById(api.project_id);
    const project = new Project(projectRes.data);

    this.props.projectListStore.setApi(api);
    this.props.projectListStore.setProject(project);
  }

  onSave = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // let { project_id, path, description, method, scheme, consumes } = values;
      values.parameters = this.parametersEditor.get();
      values.response = this.responsesEditor.get();

      const apiId = this.props.projectListStore.api.id;
      values.id = apiId;
      Api.update(values).then((data) => {
        location.hash = `/api/${apiId}`;
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

    const { projects, project, api } = this.props.projectListStore;
    return <div>
      <Card title="修改接口">
        <h3>基本信息</h3>
        <WrappedApiForm ref={this.saveFormRef} projects={projects} api={api} />
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

    if (api && api.project_id) {

    return <Form layout="horizontal">
      <FormItem {...singleItemLayout} label="项目">
        {getFieldDecorator('project_id', {
          rules: [{ required: true,  message: '请选择项目' }],
          initialValue: api.project_id.toString()
        })(
          <Select>
            {projects.map(p => <Option key={p.id}>{p.name}</Option>)}
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
                <Option key="websocket">Web Socket</Option>
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
