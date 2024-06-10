// app.js
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
let mysql = require('mysql');
var session = require('express-session');

dotenv.config({ path: './.env'})

const app = express();
const port = 3010;

let connection = mysql.createConnection({
    host:        process.env.DATABASE_HOST,
   user:        process.env.DATABASE_USER,
   password:    process.env.DATABASE_PASS,
   database:    process.env.DATABASE,
});

connection.connect( (error) => {
  if(error){
    console.log(error)
  }else{
    console.log("MYSQL Connected...")
  }
})

// const indexRouter = require('./routes/index');
// const loginRouter = require('./routes/login');
// const registerRouter = require('./routes/register');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Set secure: true in production when using HTTPS
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
// app.use('/login', loginRouter);
// app.use('/register', registerRouter);

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});

module.exports = app;