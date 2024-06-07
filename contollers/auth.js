let mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');

let connection = mysql.createConnection({
    host:        process.env.DATABASE_HOST,
   user:        process.env.DATABASE_USER,
   password:    process.env.DATABASE_PASS,
   database:    process.env.DATABASE,
});

exports.register = (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const { name, email, password, passwordConfirm } = req.body;

    connection.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            })
        }else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'The password do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        connection.query('INSERT INTO users SET ?', {username: name, email: email, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            }else{
                return res.render('register', {
                    message: 'User Registered'
                });
            }
        })
    });

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists in the database
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).render('login', {
                    message: 'An error occurred while trying to log in'
                });
            }

            if (results.length === 0) {
                return res.status(400).render('login', {
                    message: 'Email or password is incorrect'
                });
            }

            const user = results[0];

            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).render('login', {
                    message: 'Email or password is incorrect'
                });
            }

            // Successful login
            // Set session or token here if you are using session-based or token-based authentication
            // req.session.userId = user.id; // For session-based auth
            return res.status(200).render('index', {
                message: 'Logged in successfully'
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).render('login', {
            message: 'An error occurred while trying to log in'
        });
    }
    // if (isMatch) {
    //     const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    //     return res.status(200).json({
    //         message: 'Logged in successfully',
    //         token: token
    //     });
    // }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).render('error', {
                message: 'Failed to log out'
            });
        }
        res.clearCookie('connect.sid'); // This name might be different based on your session cookie name
        return res.status(200).redirect('/login'); // Redirect to the login page or homepage
    });
};