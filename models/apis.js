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
  schemes: {
    type: Sequelize.STRING(20),
    allowNull: true,
    comment: 'request schemas: http | https',
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
