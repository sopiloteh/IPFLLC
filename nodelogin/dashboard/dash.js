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
//log out: back to login page
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/nodelogin/login.html'));
		app.use(express.static(path.join(__dirname, '/nodelogin/static')));
		

	}); 
	
	app.get('/withdraw', function(request, response) {
		response.send(request.session.email);
		response.sendFile(path.join(__dirname + '/withdraw_page/withdraw_page.html'));
		app.post('/withdraws',require('./withdraw_page/withdraw'));
			
	
		}); 
		app.get('/deposit', function(request, response) {  //need to include to this because it first ran with node login.js
	
			response.sendFile(path.join(__dirname + '/Depost/deposit.html'));
			//app.use(express.static(path.join(__dirname, '/Depost/public')));
			app.post('/passwordreset',require('./Depost/deposit'));
		
		
		}); 
		app.get('/transfer', function(request, response) {  //need to include to this because it first ran with node login.js
		response.send(request.session.email);
			response.sendFile(path.join(__dirname + '/transfer/transfer.html'));
			//app.use(express.static(path.join(__dirname, '/Depost/public')));
			app.post('/transfers',require('./transfer/transferapp'));
		
		
		});
		module.exports = app;