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
	//populateDB();
});

//ROUTES
router.get('/', function(req, res){
	res.send('Tennis Ranking API!');
});

//PLAYERS API
router.route('/players')
	.get(function(req, res){
		Player.find(function(err,rows){
			if(err){
				res.send(err);
			} else {
				var players = rows;

				for(player in players){

				}

				res.json(rows);
			}
		});
	})
	.post(function(req, res){
		var model = new Player();
		model.id = req.body.id;
		model.name = req.body.name;
		model.phone = req.body.phone;
		model.points = req.body.points;

		model.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.json({message: 'Player inserted'});
			}
		});
	});

router.route('/players/:id')
	.get(function(req, res){
		var id = req.params.id;
		Player.findById(id, function (err, item){
			res.json(item);
		})
	})
	.put(function(req, res){
		var id = req.params.id;
		var player = req.body;
		Player.update({'_id': id}, player, {safe: true}, function(err, result){
			if (err){
				res.send(err);
			} else {
				res.json(player);
			}
		});
	})
	.delete(function(req, res){
		var id = req.params.id;
		console.log(id);

		Player.findById(id, function (err, item){
			if (item){
				console.log(item);
				item.remove(function(err){
					if(err){
						res.send(err);
					} else {
						res.json({message: 'Player deleted'});
					}
				});
			} else {

			}
			
		});
		
	});


//POPULATE DB - PLAYERS
var populateDB = function(){
	var players = [
		{
		"id": 1,
		"name": "Fernando Fragoso",
		"email": "fernandofragoso@gmail.com",
		"phone": "8848-2529",
		"points": 0,
		"matches": []
	},
	{
		"id": 2,
		"name": "Pedro Duarte",
		"email": "pedrocpi@hotmail.com",
		"phone": "9218-6199",
		"points": 0,
		"matches": []
	},
	{
		"id": 3,
		"name": "Ricardo Vasconcelos",
		"email": "ricardovasc@gmail.com",
		"phone": "8891-0255",
		"points": 0,
		"matches": []
	},
	{
		"id": 4,
		"name": "Luiz Henrique",
		"email": "lluizhcs@gmail.com",
		"phone": "8839-0437",
		"points": 0,
		"matches": []
	},
	{
		"id": 5,
		"name": "Emmanuel Costa",
		"email": "",
		"phone": "9587-0444",
		"points": 0,
		"matches": []
	},
	{
		"id": 6,
		"name": "João Costa",
		"email": "joao@costanordeste.com.br",
		"phone": "8773-0054",
		"points": 0,
		"matches": []
	},
	{
		"id": 7,
		"name": "Thiago Vasconcelos",
		"email": "tgouveia91@hotmail.com",
		"phone": "8838-4281",
		"points": 0,
		"matches": []
	},
	{
		"id": 8,
		"name": "Adalberto Guerra",
		"email": "",
		"phone": "8662-3164",
		"points": 0,
		"matches": []
	},
	{
		"id": 9,
		"name": "Bruno Sette",
		"email": "brunosette@gmail.com",
		"phone": "8254-9030",
		"points": 0,
		"matches": []
	},
	{
		"id": 10,
		"name": "Victor Cruz",
		"email": "victorazevedocruz@gmail.com",
		"phone": "9992-3703",
		"points": 0,
		"matches": []
	}
	];

	Player.create(players, function(err){
		if(err){
			console.log(err);
		}
	});
}

//RETURN
module.exports = router;