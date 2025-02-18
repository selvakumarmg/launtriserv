const http = require('http'); // Import the http module
const app = require('./src/routes'); // Assuming your routes are in 'src/routes'
const PORT = 3000;

const server = http.createServer(app); // Create the HTTP server using your app

// Define the route
app.get('/v1/test', (req, res) => {
  res.status(200).send({
    message: 'Launtri API Hosted',
    status: 'success',
    code: 200
  });
});

// Start the server to listen on http://0.0.0.0 (accessible externally) and the specified port
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
