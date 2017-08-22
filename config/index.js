const development = require('./development');
const production = require('./production');

module.exports = process.env.NODE_ENV === 'production' ? production : development;