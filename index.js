const app = require('./src/routes');
const PORT = 3000;

app.get('/v1/test', (req, res) => {
  res.status(200).send({
    message: 'Launtri API Hosted',
    status: 'success',
    code: 200
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
