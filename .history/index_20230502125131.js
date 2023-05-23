var express = require('express');
var app = express();

app.get('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

app.listen(7000);