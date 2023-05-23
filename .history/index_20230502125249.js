var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use

app.get('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', function(req, res){


});

app.listen(7000);