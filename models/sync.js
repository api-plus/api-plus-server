/*
  create tables and initial data
*/

const logger = require('../common/logger');
const { db } = require('./');

db.sync({
  force: (process.argv[2] === '--force'),
}).then(() => {
  logger.info('sequelize sync and init success');
}).catch(err => {
  logger.error('sequelize sync failed');
  logger.error(err);
  process.exit(1);
});