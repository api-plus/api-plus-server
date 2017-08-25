const Sequelize = require('sequelize');
const sequelize = require('./connect');
const APIs = require('./apis');

/*
  Parameters Model
*/
let Parameters = sequelize.define('parameters', {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    comment: 'parameter name',
  },
  description: {
    type: Sequelize.STRING(200),
    allowNull: false,
    comment: 'parameter description',
  },
  required: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'is parameter required',
  },
  type: {
    type: Sequelize.ENUM('string', 'boolean', 'int', 'timestamp', 'datetime', 'object', 'array', 'long', 'float'),
    allowNull: false,
    defaultValue: 'string',
    comment: 'parameter type',
  },
  default: {
    type: Sequelize.STRING(1024),
    allowNull: true,
    comment: 'parameter default value',
  },
}, {
  tableName: 'parameters',
  comment: 'parameters',
  indexes: [{
    unique: true,
    fields: ['name', 'api_id']
  }, {
    fields: ['gmt_modified']
  }]
});

APIs.hasMany(Parameters, {
  foreignKey: 'api_id',
  targetKey: 'id'
});

module.exports = Parameters;
