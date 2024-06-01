// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../library/database');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  const { email_user, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM login WHERE email_user = ? AND password = ?', [email_user, password]);
    if (rows.length > 0) {
      res.send('Login successful');
    } else {
      res.send('Invalid email or password');
    }
  } catch (err) {
    console.error(err);
    res.send('An error occurred');
  }
});

module.exports = router;
