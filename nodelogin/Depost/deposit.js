const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  });

// variables for deposit.html page
const deposit = document.getElementById("deposit");
const submit = document.getElementById("submit");
const buttonA = document.getElementById("buttonA");
const buttonB = document.getElementById("buttonB");
const buttonC = document.getElementById("buttonC");
const buttonD = document.getElementById("buttonD");
const buttonE = document.getElementById("buttonF");
const value = document.getElementById("value");

// mysql connection to talk between tables in the database
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'users',
	port:3306
	
});

// javascript session creation to keep it all hidden under the hood
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// number formater to allow currency
const formatter = new Intl.NumberFormat('en-US',{
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
});

// initalize
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/deposit', function(request, response) {
	// Render deposit template
	let amount = request.amount;
	let query = 'INSERT INTO usersinfo temp VALUES (?);';
});

if(selection==1){
	var trans = "";
	var query = connection.query(trans, ['c_balance'], function(err, result){
		//something
	})
}
else{
	var trans = "";
	var query = connection.query(trans, ['s_balance'], function(err, result){
		//something
	})
}

app.post('/', function(request, response){
  response.sendFile(path.join(__dirname + '/nodelogin//Depost/deposit.html'));
  app.use(express.static(path.join(__dirname, '/nodelogin/static')));
});


