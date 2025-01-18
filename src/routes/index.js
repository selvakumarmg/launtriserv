const express = require('express');
const router = express.Router();

// Sample route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Basic Node API!' });
});

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;
