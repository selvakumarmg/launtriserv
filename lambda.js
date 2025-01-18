const app = require('./src/routes');
const serverless = require('serverless-http');

module.exports.handler = serverless(app);
