const express = require('express');
const bodyParser = require('body-parser');
const users = require('./users');

const app = express();

app.use(bodyParser.json());
app.use('/api/v1', users);

module.exports = app;
