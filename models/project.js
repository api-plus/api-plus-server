const Sequelize = require('sequelize');
const sequelize = require('./connect');

/*
  Project Model
*/
let Project = sequelize.define('project', {
  spec: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: 'OpenAPI specification',
  },
  format: {
    type: Sequelize.ENUM('json', 'yaml'),
    allowNull: false,
    comment: 'OpenAPI specification format',
    defaultValue: 'yaml'
  },
}, {
  tableName: 'project',
  comment: 'project',
  indexes: [{
    fields: ['gmt_modified']
  }]
});

module.exports = Project;