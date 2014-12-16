//DEPENDENCIES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

//ROUTER
// app.get('/', function(req, res){
// 	res.send("Try /api");
// });

// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//BRAGA WIN
app.use(express.static(path.join(__dirname, "public")));

app.use('/api', require('./routes/api'));

//START SERVER
var server = app.listen(3000, function(){
	var host = server.address().address
	var port = server.address().port

	console.log('Server running with Express at http://' + host + ':' + port);
});