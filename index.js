lsconst express = require('express');
const bodyParser = require('body-parser');
const config = require('./src/config');
const apiRoutes = require('./src/routes');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/api', apiRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Lamda USERS!!!!' });
})

// Start the server
// app.listen(config.port, () => {
//   console.log(`Server is running on http://localhost:${config.port}`);
// });


module.exports.handler = serverless(app);