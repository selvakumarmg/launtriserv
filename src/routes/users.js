const express = require('express');

const router = express.Router();

router.get('/hello', (req, res)=>{
    res.send('Hello I am from Lamda user!')
});

module.exports = router;
