const path = require('path');
const Sequelize = require('sequelize');

// get the database config
const { database } = require('../config');
database.define = {
  timestamps: true,
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified',
  charset: 'utf8',
  collate: 'utf8_general_ci',
};

// create a database connection
const sequelize = new Sequelize(
  database.db, 
  database.username, 
  database.password, 
  database
);

// import models
function load(name) {
  return sequelize.import(path.join(__dirname, name));
}

module.exports = {
  db: sequelize,
  Projects: load('projects'),
}
