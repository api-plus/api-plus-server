const Sequelize = require('sequelize');
const sequelize = require('./connect');

/*
  Project Model
*/
let Project = sequelize.define('project', {
  yaml: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: 'OpenAPI yaml schema',
  },
}, {
  tableName: 'project',
  comment: 'project',
  indexes: [{
    fields: ['gmt_modified']
  }]
});

module.exports = Project;