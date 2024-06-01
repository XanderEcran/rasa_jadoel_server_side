let mysql = require('mysql');

let connection = mysql.createConnection({
    host:        'localhost',
   user:        'root',
   password:    '',
   database:    'jadoel',
   waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
 
  module.exports = connection;
