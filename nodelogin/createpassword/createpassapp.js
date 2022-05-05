const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');


const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'users',
	port:3306
	
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/passwordreset', function(request, response) {

	
    let password = request.body.password;
    let confirm = request.body.confirm;
let Email = request.session.email;
	
	
	connection.query('UPDATE usersinfo SET password = ?, confirm = ? WHERE email = ?',[password,confirm,Email], function(error,results,fields)
	{
		
	if (error) throw error;
	console.log("updated.");
});
response.redirect('/');
});

module.exports = app;