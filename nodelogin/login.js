const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'K@tty1996',
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
app.use(express.static(path.join(__dirname, 'static')));

//app.set('view engine','html');
// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let email = request.body.email;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM usersinfo WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			// If issue with the query, output error
			if (error) throw error;
			// If account exists
			if (results.length > 0) {
				// validate user
				request.session.loggedin = true;
				request.session.email = email;
				// go to home page
				response.redirect('/dash');
			} else {
				response.redirect('/');
				//throw "Incorrect email/password";
			}			
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});

// http://localhost:5000/dash
app.get('/dash', function(request, response) {
	
			response.sendFile(path.join(__dirname + '/dashboard/dash.html'));
		
			
		

});
app.get('/createaccount', function(request, response) {
	response.sendFile(path.join(__dirname + '/createaccount/createacc.html'));
	app.use(express.static(path.join(__dirname, '/createaccount/public')));
	app.post('/signup',require('./createaccount/app'));


	
	
	
	



});
module.exports = app;

app.listen(5000);