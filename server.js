//DEPENDENCIES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var passport = require('passport');
var cors = require('cors');

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

// app.use(function(rveq, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors());

//BRAGA WIN
app.use(express.static(path.join(__dirname, "public")));

app.use(favicon(__dirname + '/public/favicon.ico'));

//MONGOOSE CONNECTION
// mongoose.connect("mongodb://localhost/tennisapi",
mongoose.connect('mongodb://catranking:catranking@cluster0-shard-00-00.svzro.mongodb.net:27017,cluster0-shard-00-01.svzro.mongodb.net:27017,cluster0-shard-00-02.svzro.mongodb.net:27017/catranking?ssl=true&replicaSet=atlas-4kdqbx-shard-0&authSource=admin&retryWrites=true&w=majority',
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

//START SERVER
var server = app.listen((process.env.PORT || 3000), function(){
	var host = server.address().address
	var port = server.address().port

	console.log('Server running with Express at http://' + host + ':' + port);
});
