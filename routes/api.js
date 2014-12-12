//DEPENDENCIES
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//MODELS
var Player = require('../models/player');

//CONNECTION
mongoose.connect('mongodb://localhost/tennisapi', function(err){
	if(err){
		console.log("Erro no DB");
	}
});

//ADD ITEM
// var Player = mongoose.model('Player', { name: String, points: Number});

// var fernando = new Player({name: "Fernando", points: 32});
// fernando.save(function(err){
// 	if(err){
// 		console.log("Erro Salvando");
// 	} else {
// 		console.log("Salvo");
// 	}
// });

//ROUTES
router.get('/', function(req, res){
	res.send('Tennis API!');
});

router.route('/players')
	.get(function(req, res){
		console.log("GET RECEIVED");
		Player.find(function(err,rows){
			if(err){
				res.send(err);
				console.log(err);
			} else {
				res.json(rows);
				console.log(rows);
			}
		});
	})
	.post(function(req, res){
		console.log("POST RECEIVED");
		var model = new Player();
		model.id = req.body.id;
		model.name = req.body.name;
		model.points = req.body.points;

		model.save(function(err){
			if(err){
				res.send('Erro ao inserir: ' + err);
			} else {
				res.json({message: 'Player inserted'});
			}
		});
	});

//RETURN
module.exports = router;