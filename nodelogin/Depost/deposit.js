// variables for deposit.html page
//const deposit = document.getElementById("deposit");
//const submit = document.getElementById("submit");
//const buttonA = document.getElementById("buttonA");
//const buttonB = document.getElementById("buttonB");
//const buttonC = document.getElementById("buttonC");
//const buttonD = document.getElementById("buttonD");
//const buttonE = document.getElementById("buttonF");
//const value = document.getElementById("value");

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

console.log("YOU ARE HERE");
connection.connect((error) => {
    if(error) throw error;
    else
    
    console.log('SQL Connected')
    }); 

app.post('/deposit', function(request, response) {
	let currency = request.body.currency;
    let Email = request.session.email;
	let choice = request.body.select
	
    connection.query('UPDATE usersinfo SET temp = ? WHERE email = ?',[currency,Email], function(error,results,fields)
    {

    if (error) throw error;
    console.log("temp updated.");

    });

    if(choice == "checking")
    {
    connection.query('UPDATE usersinfo SET c_balance = (c_balance+temp) WHERE email = ?',[Email], function(error, results,fields) {
        if (error) throw error;
        console.log("Deposit in C bal");

    }); 
}
    else
    {
    connection.query('UPDATE usersinfo SET s_balance = (s_balance+temp) WHERE email = ?',[Email], function(error, results,fields) {
        if (error) throw error;
        console.log("Deposit in S bal");

    });
}
    response.redirect('/deposit');
});
module.exports = app;