const path = require('path');
const appRoot = path.dirname(__dirname);

module.exports = {
  appRoot: appRoot,

  /**
   * database config
   */
  database: {
    db: 'api_manager',
    username: 'root',
    password: '',

    // the sql dialect of the database
    // - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
    dialect: 'sqlite',

    // custom host; default: 127.0.0.1
    host: '127.0.0.1',

    // custom port; default: 3306
    port: 3306,

    // use pooling in order to reduce db connection overload and to increase speed
    // currently only for mysql and postgresql (since v1.5.0)
    pool: {
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 30000
    },

    // the storage engine for 'sqlite'
    // default store into {appRoot}/sqlite/data.sqlite
    storage: path.join(appRoot, 'sqlite/data.sqlite'),
  },

  /*
    log level 
    
    output: warn, error
    ignore: log, trace, debug, info
  */
  logLevel: 'warn', 
}