// TODO

import React from 'react';
import { object } from 'prop-types';
import { Button, Col, Icon, Input, Row, Select, Tabs } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import './Editor.less';

/* proptypes */
const PropTypes = {
  schema: object.isRequired
}

/* component */
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {
        "code": {
          "path": "/",
          "name": "code",
          "type": "string",
          "description": "成功或失败的代码"
        },
        "message": {
          "path": "/",
          "name": "message",
          "type": "string",
          "description": "失败的描述信息"
        },
        "data": {
          "path": "/",
          "name": "data",
          "type": "object",
          "description": "返回的实体",
          "properties": {
            "id": {
              "path": "/data",
              "name": "id",
              "type": "string",
              "description": "id"
            }
          }
        }
      }
    }
  }

  onCreate = (path, name) => {
    let newSchema = {...this.state.schema};
    let createOn = this.getByPath(newSchema, path + '/' + name);
    let count = Object.keys(createOn.properties).length;
    let defaultKey = "name-" + count;
    createOn.properties[defaultKey] = {
      "path": `${path === '/' ? '' : path}/${name}`,
      "name": defaultKey,
      "type": "string",
      "description": ""
    };
    this.setState({
      schema: newSchema
    });
  }

  onDelete = (path, name) => {
    let newSchema = {...this.state.schema};
    let toBeDelete = this.getByPath(newSchema, path);
    delete toBeDelete.properties[name];
    this.setState({
      schema: newSchema
    });
  }

  onChange = () =>  {

  }

  getByPath(obj, path) {
    let pathArr = path.split('/');
    let result = obj;
    pathArr.forEach(path => {
      if (!path) return;
      result = obj[path];
    });
    return result;
  }

  render() {
    const { schema } = this.state;
    return <div className="component-editor">
      <Row gutter={10}>
        <Col span={16}>
          <Tabs defaultActiveKey="1" size="small">
            <TabPane tab="编辑" key="1">
              <div className="form">
                <Row gutter={5}>
                  <Col span={9}>字段名</Col>
                  <Col span={6}>数据类型</Col>
                  <Col span={7}>说明</Col>
                  <Col span={2}></Col>
                </Row>
                <SchemaForm 
                  schema={schema} onChange={this.onChange}
                  onCreate={this.onCreate} onDelete={this.onDelete}
                />
              </div>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={8}>
          <Tabs defaultActiveKey="1" size="small">
            <TabPane tab="预览" key="1">
              <div className="previewer">
                <Previewer schema={schema} />
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  }
}
Editor.propTypes = PropTypes;

/* panel schema editor form */
class SchemaForm extends React.Component {
  onChange() {

  }
  onNameChange = () => {
    
  }
  onTypeChange = () => {
    
  }
  onDescriptionChange = () => {
    
  }
  onDelete = (path,name) => {
    this.props.onDelete(path, name);
  }
  onCreate = (path, name) => {
    this.props.onCreate(path, name);
  }
  renderItem(item) {
    return <Row className="item-form" gutter={5}>
      <Col span={9}>
        <Input size="large" value={item.name} placeholder="字段名" onChange={this.onNameChange} />
      </Col>
      <Col span={6}>
        <Select 
          size="large"
          className="full-width" placeholder="数据类型"
          value={item.type} onChange={this.onTypeChange}
        >
          <Option key="string">string</Option>
          <Option key="boolean">boolean</Option>
          <Option key="number">number</Option>
          <Option key="datetime">datetime</Option>
          <Option key="object">object</Option>
          <Option key="array">array</Option>
        </Select>
      </Col>
      <Col span={7}>
        <Input size="large" value={item.description} placeholder="说明" onChange={this.onDescriptionChange} />
      </Col>
      <Col span={2}>
        <a className="item-btn" onClick={this.onDelete.bind(this, item.path, item.name)}><Icon type="delete"></Icon></a>
        {item.type === 'object' && <a className="item-btn" onClick={this.onCreate.bind(this, item.path, item.name)}><Icon type="plus-circle-o"></Icon></a>}
      </Col>
    </Row>
  }

  renderForm(item) {
    return <div>
      {Object.entries(item).map(([key, value]) => {
        return <div key={key}>
          {this.renderItem(value)}
          {(value.type === 'object') && <div className="left-space-15">
            {/*<SchemaForm item={value.properties} />*/}
            {this.renderForm(value.properties)}
          </div>}
        </div>;
      })}
    </div>
  }
  
  render() {
    const { schema } = this.props;
    return <div className="object-form">
      {this.renderForm(schema)}
    </div>
  }
}

/* panel previewer */
function Previewer(props) {

  function formatSchema(schema) {
    let result = {};
    Object.entries(schema).forEach(([key, value]) => {
      if (value.type === 'object') {
        result[key] = formatSchema(value.properties);
      } else if (value.type === 'array') {
        result[key] = [];
      } else {
        // result[key] = `@${value.type} - ${value.description}`;
        result[key] = value.type;
      }
    });
    return result;
  }

  let { schema } = props;
  let json = formatSchema(schema);
  return <pre>{JSON.stringify(json, null, 4)}</pre>
}