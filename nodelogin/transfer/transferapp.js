const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');


const app = express();
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  });

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'users',
	port:3306
	
});
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection.connect((error) => {
    if(error) throw error;
    else
    
    console.log('Sql connected')
    }); 
//var selection=1;

app.post('/transfers', function(request, response) {
	// Capture the input fields
	let amount = request.body.amount;
    let Email = request.session.email;
    connection.query('UPDATE usersinfo SET temp = ? WHERE email = ?',[amount,Email], function(error,results,fields)
	{
		
	if (error) throw error;
	console.log("temp updated.");
	console.log(results);
});
/*
if(selection==1)
{
    
	var trans = "UPDATE usersinfo SET c_balance = ? WHERE email = ?";
	var query = connection.query(trans, ['c_balance+temp',Email], function(err, result) {
		console.log("Updated c bal");
	});
} 
else
{
	var trans = "UPDATE usersinfo SET s_balance = ? WHERE email=?";
	var query = connection.query(trans, ['s_balance+temp',Email], function(err, result) {
		console.log("Updated s bal");
	})
}
*/
response.redirect('/transfer');
});



module.exports = app;