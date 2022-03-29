const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const app = express();




const db = mysql.createConnection({
host     : 'localhost',
	user     : 'root',
	password : 'K@tty1996',
	database : 'users',
	port:3306,

});
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/signup', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
    let email = request.body.email;
    let confirm = request.body.password2;
    let security1 = request.body.Security1;
    let security2 = request.body.Security2;
    let query = `INSERT INTO usersinfo 
    (fullname, email,password,confirm,security1,security2) VALUES (?, ?,?,?,?,?);`;
	
	
	if (username && password && email && confirm && security1 && security2 &&(confirm==password)) {
		
		
		db.query(query, [username,email,password,confirm,security1,security2], (err, rows) => {
                if (err) throw err;
                console.log("Row inserted.");
                    
            });
			
            response.redirect('/');
			
		
	} else {
		
		response.send('passwords not match.');
		
		response.end();
	}
});
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/nodelogin/login.html'));
		app.use(express.static(path.join(__dirname, '/nodelogin/static')));
		
		
		
	
	
	}); 
	
db.connect((error) => {
    if(error) throw error;
    else
    
    console.log('sql connected')
    }); 

	module.exports = app;




