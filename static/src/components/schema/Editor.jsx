// TODO
// 1. validate

import Path from 'path';
import React from 'react';
import { bool, object, string } from 'prop-types';
import { Button, Col, Icon, Input, Row, Select, Tabs } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import './Editor.less';

// const
const Field_Types = {
  request: ['string', 'boolean', 'number'],
  response: ['string', 'boolean', 'number', 'object'],
}

/* proptypes */
const PropTypes = {
  schema: object,
  schemaType: string,
  showAddParamBtn: bool,
  showPreviewer: bool,
}
const DefaultProps = {
  schemaType: 'response',
  showAddParamBtn: false,
  showPreviewer: true,
}

/* component */
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    let schema = props.schema;
    if (props.schemaType === 'response' && !schema) {
      schema = {
        "code": {
          "path": "/code",
          "name": "code",
          "type": "string",
          "description": "成功或失败的代码"
        },
        "message": {
          "path": "/message",
          "name": "message",
          "type": "string",
          "description": "失败的描述信息"
        },
        "data": {
          "path": "/data",
          "name": "data",
          "type": "object",
          "description": "返回的数据实体",
          "properties": {}
        }
      };
    } else if (props.schemaType === 'request' && !schema) {
      schema = {
        "name": {
          "path": "/name",
          "name": "name",
          "type": "string",
          "isRequired": "false",
          "default": "",
          "description": ""
        }
      };
    }
    this.state = {
      schema
    }
  }

  onCreate = (path) => {
    let newSchema = {...this.state.schema};

    if (path === '/') {
      let count = Object.keys(newSchema).length;
      let defaultName = "name" + count;
      let defaultKey = defaultName + '-' + Date.now();
      newSchema[defaultKey] = {
        "path": `/${defaultKey}`,
        "name": defaultName,
        "type": "string",
        "description": ""
      }
      this.setState({
        schema: newSchema
      });
      return; 
    }

    let basePath = Path.dirname(path);
    let key = Path.basename(path);

    let createOn = this.getByPath(newSchema, basePath)[key];
    let count = Object.keys(createOn.properties).length;
    let defaultName = "name" + count;
    let defaultKey = defaultName + '-' + Date.now();

    createOn.properties[defaultKey] = {
      "path": `${path}/${defaultKey}`,
      "name": defaultName,
      "type": "string",
      "description": ""
    };
    this.setState({
      schema: newSchema
    });
  }

  onDelete = (path) => {
    let basePath = Path.dirname(path);
    let key = Path.basename(path);

    let newSchema = {...this.state.schema};
    let toBeDelete = this.getByPath(newSchema, basePath);
    delete toBeDelete[key];
    this.setState({
      schema: newSchema
    });
  }

  onChange = (item, prop, value) =>  {
    let basePath = Path.dirname(item.path);
    let key = Path.basename(item.path);

    let newSchema = {...this.state.schema};
    let parent = this.getByPath(newSchema, basePath);
    parent[key][prop] = value;
    if (prop === 'type' && value === 'object') {
      parent[key].properties = {};
    }
    this.setState({
      schema: newSchema
    });
  }

  getByPath(obj, path) {
    if (path === '/') return obj;

    let pathArr = path.split('/');
    let result = obj;
    pathArr.forEach(path => {
      if (!path) return;
      if (result.type === 'object') {
        result = result.properties[path];
      } else {
        result = result[path];
      }
    });
    return result.type === 'object' ? result.properties : result;
  }

  changeKey(obj) {
    let result = {};
    Object.entries(obj).forEach(([key, value]) => {
      value = {...value};
      if (value.type === 'object') {
        value.properties = this.changeKey(value.properties);
      }
      delete value.path;
      result[value.name] = value;
    });

    return result;
  }

  validate() {
    return true;
  }

  // get the schema
  get() {
    if (this.validate()) {
      let schema = {...this.state.schema};
      return this.changeKey(schema);
    } else {
      return null;
    }
  }

  render() {
    const { schema } = this.state;
    const { schemaType, showPreviewer, showAddParamBtn } = this.props;
    return <div className="component-editor">
      <Row gutter={10}>
        <Col span={showPreviewer ? 16 : 24}>
          <Tabs defaultActiveKey="1" size="small">
            <TabPane tab="编辑" key="1">
              <div className="form">
              {
                schemaType === 'response' && 
                <Row gutter={5}>
                  <Col span={9}>字段名</Col>
                  <Col span={6}>数据类型</Col>
                  <Col span={7}>说明</Col>
                  <Col span={2}></Col>
                </Row>
              }
              {
                schemaType === 'request' && 
                <Row gutter={5}>
                  <Col span={5}>字段名</Col>
                  <Col span={4}>数据类型</Col>
                  <Col span={4}>是否必填</Col>
                  <Col span={4}>默认值</Col>
                  <Col span={5}>说明</Col>
                  <Col span={2}></Col>
                </Row>
              }
                <SchemaForm 
                  schemaType={schemaType}
                  showAddParamBtn={showAddParamBtn}
                  schema={schema} onChange={this.onChange}
                  onCreate={this.onCreate} onDelete={this.onDelete}
                />
              </div>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={showPreviewer ? 8 : 0}>
          <Tabs defaultActiveKey="1" size="small">
            <TabPane tab="预览" key="1">
              <div className="previewer">
                <Previewer schema={schema} />
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <br />
    </div>
  }
}
Editor.propTypes = PropTypes;
Editor.defaultProps = DefaultProps;

/* panel schema editor form */
class SchemaForm extends React.Component {
  onChange(item, prop, e) {
    let value = (prop === 'type' || prop === 'isRequired') ? e : e.target.value;
    this.props.onChange(item, prop, value);
  }
  onDelete = (path) => {
    this.props.onDelete(path);
  }
  onCreate = (path) => {
    this.props.onCreate(path);
  }
  renderItem(item) {
    const { schemaType } = this.props;
    return <Row className="item-form" gutter={5}>
      <Col span={schemaType === 'response' ? 9 : 5}>
        <Input 
          size="large" placeholder="字段名" value={item.name}
          onChange={this.onChange.bind(this, item, 'name')} 
        />
      </Col>
      <Col span={schemaType === 'response' ? 6 : 4}>
        <Select 
          size="large" value={item.type}
          className="full-width" placeholder="数据类型"
          onChange={this.onChange.bind(this, item, 'type')}
        >
          {Field_Types[schemaType].map(type => {

            return <Option key={type}>{type}</Option>
          })}
        </Select>
      </Col>
      {
        schemaType === 'request' && 
        <Col span={4}>
          <Select 
            size="large" value={item.isRequired}
            className="full-width" placeholder="请选择"
            onChange={this.onChange.bind(this, item, 'isRequired')}
          >
            <Option key="true">是</Option>
            <Option key="false">否</Option>
          </Select>
        </Col>
      }
      {
        schemaType === 'request' && 
        <Col span={4}>
          <Input 
            size="large" placeholder="默认值" value={item.default}
            onChange={this.onChange.bind(this, item, 'default')}
          />
        </Col>
      }
      <Col span={schemaType === 'response' ? 7 : 5}>
        <Input 
          size="large" placeholder="说明" value={item.description}
          onChange={this.onChange.bind(this, item, 'description')}
        />
      </Col>
      <Col span={2}>
        <a className="item-btn" onClick={this.onDelete.bind(this, item.path)}><Icon type="delete"></Icon></a>
        {
          item.type === 'object' && 
          <a className="item-btn" onClick={this.onCreate.bind(this, item.path)}>
            <Icon type="plus-circle-o"></Icon>
          </a>
        }
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
    const { schema, showAddParamBtn } = this.props;
    return <div className="object-form">
      {this.renderForm(schema)}
      { 
        showAddParamBtn && 
        <Button className="add-param-btn" icon="plus" onClick={this.onCreate.bind(this, '/')}>添加字段</Button>
      }
    </div>
  }
}

/* panel previewer */
function Previewer(props) {

  function formatSchema(schema) {
    let result = {};
    Object.entries(schema).forEach(([key, value]) => {
      if (value.type === 'object') {
        result[value.name] = formatSchema(value.properties);
      } else if (value.type === 'array') {
        result[value.name] = [];
      } else {
        // result[key] = `@${value.type} - ${value.description}`;
        result[value.name] = value.type;
      }
    });
    return result;
  }

  let { schema } = props;
  let json = formatSchema(schema);
  return <pre>{JSON.stringify(json, null, 4)}</pre>
}