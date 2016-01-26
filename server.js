//DEPENDENCIES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var passport = require('passport');

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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//BRAGA WIN
app.use(express.static(path.join(__dirname, "public")));

app.use(favicon(__dirname + '/public/favicon.ico'));

//MONGOOSE CONNECTION
// mongoose.connect("mongodb://localhost/tennisapi",
mongoose.connect('mongodb://heroku_app32612022:1aep7n66hoodpnpdsr4fpoi3g0@ds027741.mongolab.com:27741/heroku_app32612022',
	function(err){
		if(err){
			console.log("######## NO DB CONNECTION!! ######## " + err);
		}
		// populateDB();
	});

// AUTHENTICATION WITH PASSPORT
auth = function(req, res, next){
	if (!req.isAuthenticated())
		res.sendStatus(401);
	else
		next();
};

app.use('/api', require('./routes/api'));

app.use('/adm', require('./routes/adm'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//START SERVER
var server = app.listen((process.env.PORT || 3000), function(){
	var host = server.address().address
	var port = server.address().port

	console.log('Server running with Express at http://' + host + ':' + port);
});
