/* These lines of code are importing necessary modules for the Node.js application. */
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

/* This line of code is creating a connection to a MySQL database with the specified host, username,
password, and database name. The `mysql` module is being used to create the connection. */
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'ttiot_phpadmin'
});

/* `const app = express();` is creating an instance of the Express application. This instance will be
used to configure middleware, set up routes, and start the server. */
const app = express();

/* `app.use(session({...}))` is configuring the middleware for the Express application to use sessions.
The `session` module is being used to create a session middleware. The `secret` property is used to
sign the session ID cookie, `resave` property forces the session to be saved back to the session
store, even if the session was never modified during the request, and `saveUninitialized` property
forces a session that is "uninitialized" to be saved to the store. */
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


/* These lines of code are configuring middleware for the Express application. */
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


/* These lines of code are setting up routes for the Express application. */
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

/* This code block is setting up a route for the Express application to handle a POST request to
register a new user. It retrieves the user's full name, username, email, password, confirm password,
and address from the request body. It then checks if the username and password are not empty. If
they are not empty, it inserts the user's information into the MySQL database using a SQL query. If
there is an error, it throws an error. If the insertion is successful, it sets the session variables
for the logged-in user and redirects them to the login page. If the username and password are empty,
it sends an error message to the response. */
app.post('/register', function(request, response) {
	let fullname = request.body.fullname;
	let username = request.body.username;
	let email = request.body.email;
	let password = request.body.password;
	let confirmpassword = request.body.confirmpassword;
	let address = request.body.address;
	if (username && password) {
		connection.query('INSERT INTO user (fullname, username, email, password, confirmpassword, address) VALUES (?, ?, ?, ?, ?, ?)', [fullname, username,email, password, confirmpassword, address], function(error, results, fields) {
			if (error) throw error;
			request.session.loggedin = true;
			request.session.username = username;
			response.redirect('/login');
			response.end();
		});
	} else {
		response.send('Erorr!');
		response.end();
	}
});

/* This code block is setting up a route for the Express application to handle a POST request to log in
a user. It retrieves the user's username and password from the request body. It then checks if the
username and password are not empty. If they are not empty, it queries the MySQL database to check
if there is a user with the given username and password. If there is a user, it sets the session
variables for the logged-in user and redirects them to the home page. If there is no user with the
given username and password, it sends an error message to the response. If the username and password
are empty, it sends an error message to the response. */
app.post('/login', function(request, response) {
	let username = request.body.username;
	let password = request.body.password;

	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
			    response.redirect('/');

			} else {
                response.send('<script>alert("Incorrect Username and/or Password!"); window.location="/login";</script>');
                response.end();
			}			
			response.end();
		});
	} else {
        response.send('<script>alert("Username or Password cannot be empty!"); window.location="/login";</script>');
	}
});


app.get('/update-password', function(request, response) {
	response.sendFile(path.join(__dirname + '/forgot-password.html'));
});


app.post('/update-password', function(request, response) {
	let username = request.body.username;
	let oldPassword = request.body.password;
	let newPassword = request.body.newpassword;
	// let newPassword = document.getElementById(forgot-password).values;

	if (username && oldPassword && newPassword) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, oldPassword], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				connection.query('UPDATE user SET password = ? WHERE username = ?', [newPassword, username], function(error, results, fields) {
					if (error) throw error;

					response.send('<script>alert("Password updated!"); window.location="/login";</script>');
				});
			} else {
				response.send('<script>alert("Incorrect Username or Password!"); window.location="/update-password";</script>');
			}			
		});
	} else {
		response.send('<script>alert("All fields are required!"); window.location="/update-password";</script>');
	}
});	


/* `app.listen(3000, ()=>{ console.log("Server started on Port 3000"); })` is starting the Express
application and listening for incoming requests on port 3000. When the server starts, it logs a
message to the console indicating that the server has started on port 3000. */
app.listen(4100, ()=>{
    console.log("Server started on Port 4100");
})