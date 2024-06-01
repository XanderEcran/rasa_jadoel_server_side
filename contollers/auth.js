let mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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