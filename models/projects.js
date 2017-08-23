const Sequelize = require('sequelize');
const sequelize = require('./connect');

/*
  Projects Model
*/
let Projects = sequelize.define('projects', {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    comment: 'project name',
  },
  description: {
    type: Sequelize.STRING(200),
    allowNull: true,
    comment: 'project description',
  },
  production: {
    type: Sequelize.STRING(1024),
    allowNull: true,
    comment: 'production server host',
  },
  development: {
    type: Sequelize.STRING(1024),
    allowNull: true,
    comment: 'development server host',
  },
  testing: {
    type: Sequelize.STRING(1024),
    allowNull: true,
    comment: 'testing server host',
  },
}, {
  tableName: 'projects',
  comment: 'projects',
  indexes: [{
    unique: true,
    fields: ['name']
  }, {
    fields: ['gmt_modified']
  }]
});

// Projects.hasMany(APIs);

module.exports = Projects;