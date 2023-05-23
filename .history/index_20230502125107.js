var express = require('express');
var app = express();

app.get('/regis', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

app.listen(7000);