import React from 'react';
import { func } from 'prop-types';
import { Alert, Button, Input, Select } from 'antd';
const Option = Select.Option;

import './Import.less';
/* proptypes */
const PropTypes = {
  onImport: func.isRequired,
}
const DefaultProps = {
}

export default class Import extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      importString: '',
      hasError: false,
    }
  }

  // 获取给定数据的类型
  // 'string', 'number', 'boolean', 'object', 'array[string]', 'array[number]', 'array[boolean]', 'array[object]'
  getType(data) {
    let type = 'string'; // 默认是 string 型

    if ((typeof data === 'object' && data === null) || (typeof data === 'undefined')) {
      // null or undefined
      type = 'string';
    } else if (typeof data === 'object' && !Array.isArray(data)) {
      // 对象
      type = 'object';
    } else if (typeof data === 'object' && Array.isArray(data)) {
      // 数组
      if (data.length) {
        type = 'array[' + this.getType(data[0]) + ']';
      } else {
        type = 'array[string]';
      }
    } else {
      // number,string,boolean
      type = typeof data;
    }
    return type;
  }

  parse(json, schema = {}) {
    Object.entries(json).forEach(([key, value]) => {
      schema[key] = {
        name: key,
        isRequired: 'false',
        default: '',
        description: '',
      }; 
      let type = this.getType(value);
      schema[key].type = type;
      if (type === 'object') {
        // 对象
        schema[key].properties = this.parse(value);
      } else if (type.startsWith('array')) {
        // 数组
        schema[key].properties = this.parse(value[0]);;
      }
    });
    return schema;
  }

  onImportBtnClicked = () => {
    let { importString } = this.state;
    try {
      let json = JSON.parse(importString);
      let schema = this.parse(json);
      this.props.onImport(schema);
      this.setState({ 
        importString: '',
        hasError: false,
      });
    } catch(e) {
      this.setState({
        hasError: true,
      });
      throw e;
    }
  }
  onimportStringChanged = (e) => {
    this.setState({ importString: e.target.value });
  }
  render() {
    let { importString, hasError } = this.state;
    return <div className="component-schema-import">
      <label>数据类型：</label>
      <Select className="import-data-type" defaultValue="json">
        <Option key="json">JSON</Option>
        <Option key="swagger" disabled>Swagger</Option>
      </Select>
      <Button type="primary" onClick={this.onImportBtnClicked}>导入</Button>
      <Input 
        className="import-ipt"
        type="textarea" placeholder="请输入 JSON 格式的数据" 
        autosize={{ minRows: 10, maxRows: 50 }}
        value={importString} onChange={this.onimportStringChanged}
      />
      { 
        hasError ?
        <Alert message="JSON 格式有误" type="error" showIcon /> :
        null
      }
    </div>
  }
}
Import.propTypes = PropTypes;
Import.defaultProps = DefaultProps;