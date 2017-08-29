import React from 'react';
import { object, string } from 'prop-types';
import { Table } from 'antd';

import './Previewer.less';

const Fields = {
  request: ['name', 'description', 'type', 'default', 'isRequired'],
  response: ['name', 'description', 'type'],
}


/* proptypes */
const PropTypes = {
  schema: object,
  format: string, // json, table
}
const DefaultProps = {
  format: 'json',
}

export default class Previewer extends React.Component {
  jsonFormat(schema) {
    let result = {};
    Object.entries(schema).forEach(([key, value]) => {
      if (value.type === 'object') {
        result[value.name] = this.jsonFormat(value.properties);
      } else if (value.type.includes('array')) {
        /array\[(\w+)\]/.test(value.type);
        let type = RegExp.$1;
        if (type === 'object') {
          result[value.name] = [this.jsonFormat(value.properties)];
        } else {
          result[value.name] = [type];
        }
      } else {
        result[value.name] = value.type;
      }
    });
    return result;
  }

  render() {
    let { schema, format, type } = this.props;
    if (format === 'table') {
      let columns = [{
        title: '字段名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      }, {
        title: '格式',
        dataIndex: 'schema',
        key: 'schema',
        render: (text, record) => {
          return <Previewer schema={record.schema} format="json" type="response" />
        }
      }];
      if (type === 'request') {
        columns.push({
          title: '是否必填',
          dataIndex: 'isRequired',
          key: 'isRequired',
        });
        columns.push({
          title: '默认值',
          dataIndex: 'default',
          key: 'default',
        });
      }
      let dataSource = Object.entries(schema).map(([key, value]) => {
        return {
          key: value.name,
          name: value.name,
          description: value.description,
          type: value.type,
          schema: value.properties,
          default: value.default || '-',
          isRequired: value.isRequired
        }
      });
      
      return (
      <Table 
        className="component-schema-previewer" 
        size="middle" bordered={true}
        dataSource={dataSource} columns={columns} 
        pagination={false} 
      />
      );
    } else {
      if (schema) {
        let json = this.jsonFormat(schema);
        return <pre className="component-schema-previewer">{JSON.stringify(json, null, 4)}</pre>
      } else {
        return <div>-</div>;
      }
    }
  }
}
Previewer.propTypes = PropTypes;
Previewer.defaultProps = DefaultProps;