var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:t}))

app.get('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', function(req, res){


});

app.listen(7000);