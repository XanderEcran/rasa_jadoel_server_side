// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/indexUser', (req,res) => {
  res.render('indexUser');
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
