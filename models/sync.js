const logger = require('../common/logger');
const { db } = require('./');

db.sync({
  force: true,
}).then(() => {
  logger.info('sequelize sync and init success');
}).catch(err => {
  logger.error('sequelize sync failed');
  logger.error(err);
  process.exit(1);
});