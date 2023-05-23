var express = require('express');
var app = express();
var con = require('./connection');
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

    con.connect(function(error){
        if(error) throw error;
        var sql = "INSERT INTO `user`(`fullname`, `username`, `email`, `password`, `confirmpassword`, `address`) VALUES ('fullname','username','email','password','confirmpassword','address')";
        con.query(sql, function(error, result){
            if(error) throw error;
            res.send('User Register successfull');
        });
    });

});

app.listen(7000);