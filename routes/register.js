// routes/register.js
const express = require('express');
const router = express.Router();
const db = require('../library/database');

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
    const { nama_user, password, email_user, tgl_lahir } = req.body;
  
    if (!nama_user || !password || !email_user || !tgl_lahir) {
      return res.status(400).send('All fields are required');
    }
  
    try {
      const [result] = await db.execute(
        'INSERT INTO register (nama_user, password, email_user, tgl_lahir, status) VALUES (?, ?, ?, ?, "user")', 
        [nama_user, password, email_user, tgl_lahir]
      );
  
      const [rows] = await db.execute(
        'SELECT id_user FROM register WHERE email_user = ?', 
        [email_user]
      );
      const id_user = rows[0].id_user;
  
      await db.execute(
        'INSERT INTO login (id_user, nama_user, password, email_user, status) VALUES (?, ?, ?, ?, "user")', 
        [id_user, nama_user, password, email_user]
      );
  
      res.send('Registration successful');
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).send('An error occurred');
    }
  });
  

module.exports = router;
