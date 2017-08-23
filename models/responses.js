const Sequelize = require('sequelize');
const sequelize = require('./connect');
const APIs = require('./apis');

/*
  Responses Model
*/
let Responses = sequelize.define('responses', {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    comment: 'responses name',
  },
  description: {
    type: Sequelize.STRING(200),
    allowNull: true,
    comment: 'responses description',
  },
  type: {
    type: Sequelize.ENUM('string', 'boolean', 'int', 'timestamp', 'datetime', 'object', 'array', 'long', 'float'),
    allowNull: false,
    defaultValue: 'string',
    comment: 'responses type',
  }
}, {
  tableName: 'responses',
  comment: 'responses',
  indexes: [{
    unique: true,
    fields: ['name', 'api_id']
  }, {
    fields: ['gmt_modified']
  }]
});

APIs.hasMany(Responses, {
  foreignKey: 'api_id',
  targetKey: 'id'
});

module.exports = Responses;
