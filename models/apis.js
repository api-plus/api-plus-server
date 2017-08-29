const Sequelize = require('sequelize');
const sequelize = require('./connect');
const Projects = require('./projects');

/*
  APIs Model
*/
let APIs = sequelize.define('apis', {
  path: {
    type: Sequelize.STRING(100),
    allowNull: false,
    comment: 'api path',
  },
  description: {
    type: Sequelize.STRING(200),
    allowNull: true,
    comment: 'api description',
  },
  scheme: {
    type: Sequelize.STRING(20),
    allowNull: true,
    comment: 'request schemas: http | https',
  },
  method: {
    type: Sequelize.STRING(10),
    allowNull: true,
    comment: 'request method: GET | POST | DELETE | PUT',
  },
  consumes: {
    type: Sequelize.STRING(100),
    allowNull: true,
    comment: 'response content type',
  },
  produces: {
    type: Sequelize.STRING(100),
    allowNull: true,
    comment: 'request content type',
  },
  parameters: {
    type: Sequelize.JSON,
    allowNull: true,
    comment: 'request parameters schema',
  },
  response: {
    type: Sequelize.JSON,
    allowNull: true,
    comment: 'response schema',
  },
}, {
  tableName: 'apis',
  comment: 'apis',
  indexes: [{
    unique: true,
    fields: ['path', 'project_id']
  }, {
    fields: ['gmt_modified']
  }]
});

Projects.hasMany(APIs, {
  foreignKey: 'project_id',
  targetKey: 'id'
});

module.exports = APIs;
