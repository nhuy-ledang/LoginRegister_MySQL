var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', function(req, res){
    // console.log(req.body);
    var fullname = req.body.fullname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmpassword = req.body.confirmpassword;
    var addresss = req.body.addresss;

    

});

app.listen(7000);