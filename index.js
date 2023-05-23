// Nhập vào cái module cần thiết
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

// Tạo kết nối với cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'ttiot_phpadmin' // Tên database được tạo trên phpMyAdmin
});

const app = express(); // biến xử lý yêu cầu/phản hồi client

app.use(session({
	secret: 'secret', //Chuỗi bí mật được sử dụng để ký và mã hóa session ID
	resave: true, //cho phép lưu
	saveUninitialized: true //cho phép section mới lưu
}));

//đăng ký với app các middleware(chương trình con)
app.use(express.static(__dirname)); // cung cấpteepj tĩnh:css js
app.use(express.json());			//phân tích y/c có dang json từ client
app.use(express.urlencoded({ extended: true })); // phân tích y/c dạng URL-encoded 
app.use(express.static(path.join(__dirname, 'static')));

// chuyển đến trang tương ứng theo địa chỉ đường dẫn khi nhận các req,res
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.get('/main', function(request, response) {
	response.sendFile(path.join(__dirname + '/main.html'));
});

app.get('/update-password', function(request, response) {
	response.sendFile(path.join(__dirname + '/forgot-password.html'));
});

// đăng ký user mới
// khi gửi yêu cầu POST đến đường dẫn register, mã được thực thi
app.post('/register', function(request, response) {
	//truy cập các giá trị gửi từ client
	let fullname = request.body.fullname;
	let username = request.body.username;
	let email = request.body.email;
	let password = request.body.password;
	let confirmpassword = request.body.confirmpassword;
	let address = request.body.address;
	if (username && password) {
		// nếu user và pass đều dc cung cấp
		// thực hiện truy vấn INSERT INTO chèn dữ liệu vào bẳng 'user'
		connection.query('INSERT INTO user (fullname, username, email, password, confirmpassword, address) VALUES (?, ?, ?, ?, ?, ?)', [fullname, username,email, password, confirmpassword, address], function(error, results, fields) {
			if (error) throw error;
			// truy vấn thành công
			request.session.loggedin = true; //loggedin=true cho biết truy vấn thành công
			request.session.username = username; // username=username được truyền vào
			response.redirect('/login'); // chuyển đên trang login
			response.end();
		});
	} else {
		response.send('Erorr!');
		response.end();
	}
});

//Login
// khi gửi yêu cầu POST đến đường dẫn login, mã được thực thi
app.post('/login', function(request, response) {
	//truy cập các giá trị gửi từ client
	let username = request.body.username;
	let password = request.body.password;

	if (username && password) {
		//truy vấn kiểm tra có user và pass tương ứng trong bảng không
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
			    response.redirect('/main');

			} else {
				// không có ngưỜi dùng đúng-->báo lỗi-->trang đăng nhập
                response.send('<script>alert("Incorrect Username and/or Password!"); window.location="/login";</script>');
                response.end();
			}			
			response.end();
		});
	} else {
        response.send('<script>alert("Username or Password cannot be empty!"); window.location="/login";</script>');
	}
});

//Update password
// khi gửi yêu cầu POST đến đường dẫn update-password, mã được thực thi
app.post('/update-password', function(request, response) {
	//truy cập các giá trị gửi từ client 
	//truy vấn SQL SELECT kiểm tra có người dùng ko
	let username = request.body.username;
	// let oldPassword = request.body.oldpassword;
	let newPassword = request.body.newpassword;

	if (username && newPassword) {
		//đúng--> thực hiện truy vấn
		connection.query('SELECT * FROM user WHERE username = ?', [username], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				//rs>0--> có người dùng phù hợp
				// tiếp tục thực hiện truy vấn UPDATE
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

//Khỏi động máy chủ, lắng nghe yêu cầu từ port 4100
app.listen(4100, ()=>{
    console.log("Server started on Port 4100");
})