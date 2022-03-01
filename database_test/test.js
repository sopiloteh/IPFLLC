 var msg = 'hello world';
console.log(msg);

const mysql = require("mysql2")
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '!@Sierra259',
  database : 'banklogin'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.execute(
  'SELECT * FROM `accounts` WHERE `username` = ? AND `password` > ?',
  ['username', 'password'],
  function(err,username,password){
      console.log(username);
      console.log(password);
    }
);
 
connection.end();

