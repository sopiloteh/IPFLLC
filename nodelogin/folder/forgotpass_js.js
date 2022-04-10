const email = document.getElementById('email');
const security1 = document.getElementById('security1');
const security2 = document.getElementById('security2');
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'nodelogin'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/forgotpass_style.css')));

app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/forgotpass.html'));
});
app.post('/forgotpass', function(request,response){
    let email = request.body.email;
	let security1 = request.body.security1;
let security2 = request.body.security2;

if(email && security1 && security2){
    connection.query('SELECT * FROM accounts WHERE email = ? AND security1 = ? AND security2= ?', [email, security1,security2], function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0){
            request.session.createpass = true;

            response.redirect('/createpassword');
        }
        else{
            response.send('Incorrect email or security questions.')
        }
        response.end();
    });
}
else{
response.send('Please enter all of the fields.');
response.end();
}
});

app.get('/createpassword', function(request, response) {
	// If user is loggedin
	if (request.session.createpass) 
		// Output username
		response.send('create new password this page');
	
	response.end();
});

app.listen(3000);
/*
form.addEventListener('submit', e => {
    e.preventDefault();

    validateInputs();
});
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
    
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');//.error in css

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const validateInputs = () => {
    const security1value = security1.value.trim();
    const security2value = security2.value.trim();
    const emailValue = email.value.trim();
    
    if(security1value === '') {
        setError(security1, 'Question 1 required.');
    } 
     else {
        setSuccess(security1);
    }
    if(security2value === '') {
        setError(security2, 'Question 2 required.');
    } 
     else {
        setSuccess(security2);
    }
    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }  */
