const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');


const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'users',
	port:3306
	
});

const app = express();
//const temp = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//let temp;

app.post('/forgotpassword', function (request, response) {


    let email = request.body.email;
    let security1 = request.body.Security1;
    let security2 = request.body.Security2;

	if (email && security1 && security2) {
		
		connection.query('SELECT * FROM usersinfo WHERE email = ? AND security1 = ? AND security2 = ?', [email, security1,security2], function(error, results, fields) {
			
			if (error) throw error;
			// If account exists
			if (results.length > 0) {
				request.session.email= email;
				response.redirect('/createpass'); 

			} else {

				response.redirect('/forgotpass');
				
				
			}			
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}

});

app.get('/createpass', function(request, response) {
	response.send(request.session.email);
	response.sendFile(path.join(__dirname + '/createpassword/createpass.html'));
	app.use(express.static(path.join(__dirname, '/createpassword/public')));
	app.post('/passwordreset',require('./createpassword/createpassapp'));



}); 

module.exports = app;
