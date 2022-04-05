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

app.get('/', function(request, response) {
	// Render deposit template
	response.sendFile(path.join(__dirname + '/deposit.html'));
});

app.post('/', function(request, response){
  response.sendFile(path.join(__dirname + '/nodelogin/deposit.html'));
  app.use(express.static(path.join(__dirname, '/nodelogin/static')));
});