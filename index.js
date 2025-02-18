const app = require('./src/routes');

const PORT = 3000;

app.get('/api/v1/test', (req, res) => {
  res.send('Launtri API Hosted');
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
