var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

app.listen(7000);