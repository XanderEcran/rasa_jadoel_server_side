// routes/index.js
const express = require('express');
const authController = require('../contollers/auth')
const router = express.Router();

router.post('/register', authController.register );
router.post('/login', authController.login);
router.post('/logout', authController.logout);

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Protect your dashboard route
router.get('/index', isAuthenticated, (req, res) => {
    res.render('index', { message: 'Welcome back!', username: req.session.username });
});

module.exports = router;
