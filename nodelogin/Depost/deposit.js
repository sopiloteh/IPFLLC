const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

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

// number formater to allow currency
const formatter = new Intl.NumberFormat('en-US',{
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
});

switch (value){
	case Cash:
		if (value == Cash && value == Checking){
			// do something
		}
		else if (value == Cash && value == Savings){
			// do something
		}
		else if (value == Cash && value == Pokemon_Slush){
			// do something
		}
		else{
			break;
		}
	break;	
	case Check:
		if (value == Check && value == Checking){
			// save to table in mysql
		}
		else if (value == Check && value == Savings){
			// save to table in mysql
		}
		else if (value == Check && value == Pokemon_Slush){
			// save to table in mysql
		}
		else{
			break;
		}
	break;
	case Money_Order:
		if (value == Money_Order && value == Checking){
			// save to table in mysql
		}
		else if (value == Money_Order && value == Savings){
			// save to table in mysql
		}
		else if (value == Money_Order && value == Pokemon_Slush){
			// save to table in mysql
		}
		else{
			break;
		}
	break;
}

submit.addEventListener('click', () =>{
	//something inside
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(_request, response) {
	// Render deposit template
	response.sendFile(path.join(__dirname + '/deposit.html'));
});

app.post('/', function(_request, response){
  response.sendFile(path.join(__dirname + '/nodelogin//Depost/deposit.html'));
  app.use(express.static(path.join(__dirname, '/nodelogin/static')));
});