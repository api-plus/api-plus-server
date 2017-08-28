// TODO
// 1. validate

import React from 'react';
import { array, func, object } from 'prop-types';
import { Button, Col, Input, Row, Select } from 'antd';
const Option = Select.Option;

/* proptypes */
const PropTypes = {
  parameters: array.isRequired
}

export default class ParameterEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parameters: [...props.parameters].map((p, i) => {
        p.index = i;
        return p;
      })
    }
  }

  onAddBtnClicked = () => {
    let parameters = [...this.state.parameters];
    parameters.push({
      name: '',
      require: 'false',
      type: 'string',
      default: '',
      description: '',
      index: parameters.length
    });
    this.setState({ parameters });
  }

  onParameterChange = (parameter) => {
    let parameters = this.state.parameters.map(p => {
      if (p.index === parameter.index) {
        return parameter;
      } else {
        return p
      }
    });
    this.setState({ 
      parameters
    });
  }
  get() {
    return this.state.parameters.map(p => {
      p.require = (p.require === 'true');
      return p;
    });
  }
  render() {
    const params = this.state.parameters;
    return <div>
      {params.length !== 0 && <Row gutter={5}>
        <Col span={6}>参数名称</Col>
        <Col span={2}>是否必选</Col>
        <Col span={4}>数据类型</Col>
        <Col span={6}>默认值</Col>
        <Col span={6}>说明</Col>
      </Row>}
      {params.map((p, i) => {
        return <Parameter key={i} parameter={p} onChange={this.onParameterChange} />
      })}
      <Button icon="plus" onClick={this.onAddBtnClicked}>添加参数</Button>
    </div>
  }
}
ParameterEditor.propTypes = PropTypes;

/* one parameter */
class Parameter extends React.Component {
  static propTypes = {
    parameter: object.isRequired,
    onChange: func.isRequired
  }
  onNameChange = (e) => {
    this.props.onChange(Object.assign({}, this.props.parameter, {
      name: e.target.value
    }));
  }
  onRequireChange = (value) => {
    this.props.onChange(Object.assign({}, this.props.parameter, {
      require: value
    }));
  }
  onTypeChange = (value) => {
    this.props.onChange(Object.assign({}, this.props.parameter, {
      type: value
    }));
  }
  onDefaultChange = (e) => {
    this.props.onChange(Object.assign({}, this.props.parameter, {
      default: e.target.value
    }));
  }
  onDescriptionChange = (e) => {
    this.props.onChange(Object.assign({}, this.props.parameter, {
      description: e.target.value
    }));
  }

  render() {
    const p = this.props.parameter;
    return <Row className="parameter-item" gutter={5}>
      <Col span={6}>
        <Input size="large" value={p.name} placeholder="参数名称" onChange={this.onNameChange} />
      </Col>
      <Col span={2}>
        <Select 
          size="large"
          className="full-width" placeholder="是否必选"
          value={p.require} onChange={this.onRequireChange}
        >
          <Option key="true">是</Option>
          <Option key="false">否</Option>
        </Select>
      </Col>
      <Col span={4}>
        <Select 
          size="large"
          className="full-width" placeholder="数据类型"
          value={p.type} onChange={this.onTypeChange}
        >
          <Option key="string">string</Option>
          <Option key="boolean">boolean</Option>
          <Option key="number">number</Option>
          {/*<Option key="datetime">datetime</Option>
          <Option key="object">object</Option>
          <Option key="array">array</Option>*/}
        </Select>
      </Col>
      <Col span={6}>
        <Input size="large" value={p.default} placeholder="默认值" onChange={this.onDefaultChange} />
      </Col>
      <Col span={6}>
        <Input size="large" value={p.description} placeholder="说明" onChange={this.onDescriptionChange} />
      </Col>
    </Row>
  }
}