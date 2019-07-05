//DEPENDENCIES
var express = require('express');
var router = express.Router();

//MODELS
var Player = require('../models/player');
var Tournament = require('../models/tournament');
var Match = require('../models/match');

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
				res.json(rows.filter(() => rows.disabled !== false));
			}
		});
	})
	.post(function(req, res){
		var model = new Player();

		model.name = req.body.name;
		model.phone = req.body.phone;
		model.phone = req.body.email;
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
		var player;
		Player.findById(id, function (err, item){
			if (err) {
				console.log(err);
			} else {
				if (item) {
					player = item.toObject();
					//GET TOURNAMENTS FROM THIS PLAYER
					Tournament.find({ "players":id }, function(err,rows){
						if (err){
							console.log(err);
						} else {
							player.tournaments = rows;
							//GET MATCHES FROM THIS PLAYER
							Match.find({ $or : [{ "p1_id" : id },{ "p2_id" : id }] }, function(err,rows){
								if (err) {
									console.log(err);
								} else {
									player.matches = rows;
									res.json(player);
								}
							});
						}
					});
				} else {
					res.send({message: 'Player not found'});
				}
			}
		});
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

//TOURNAMENTS API
router.route('/tournaments')
	.get(function(req, res){
		Tournament.find(function(err,rows){
			if(err){
				res.send(err);
			} else {
				res.json(rows);
			}
		});
	})
	.post(function(req, res){
		var model = new Tournament();

		model.name = req.body.name;
		model.running = req.body.running;
		model.players = req.body.players;
		model.matches = req.body.matches;

		model.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.json({message: 'Tournament inserted'});
			}
		});
	});

router.route('/tournaments/:id')
	.get(function(req, res){
		var id = req.params.id;
		Tournament.findById(id, function (err, item){
			if (err){
				console.log(err);
			} else {
				tournament = item.toObject();
				//GET MATCHES FROM THIS TOURNAMENT
				Match.find({ "tourn_id":id }).find(function(err,rows){
					if(err){
						console.log(err);
					} else {
						tournament.matches = rows;
						res.json(tournament);
					}

				});

			}
		});
	})
	.put(function(req, res){
		var id = req.params.id;
		var tournament = req.body;
		Tournament.update({'_id': id}, tournament, {safe: true}, function(err, result){
			if (err){
				res.send(err);
			} else {
				res.json(tournament);
			}
		});
	})
	.delete(function(req, res){
		var id = req.params.id;

		Tournament.findById(id, function (err, item){
			if (item){
				item.remove(function(err){
					if(err){
						res.send(err);
					} else {
						res.json({message: 'Tournament deleted'});
					}
				});
			} else {

			}

		});

	});

//MATCHES API
router.route('/matches')
	.get(function(req, res){
		Match.find(function(err,rows){
			if(err){
				res.send(err);
			} else {
				res.json(rows);
			}
		});
	})
	.post(function(req, res){
		var model = new Match();

		model.tourn_id = req.body.tourn_id;
		model.p1_id = req.body.p1_id;
		model.p2_id = req.body.p2_id;
		model.round = req.body.round;
		model.bracket_b = req.body.bracket_b;
		model.score = req.body.score;

		model.save(function(err){
			if(err){
				res.send(err);
			} else {
				res.json({message: 'Match inserted'});
			}
		});
	});

router.route('/matches/:id')
	.get(function(req, res){
		var id = req.params.id;
		Match.findById(id, function (err, item){
			if (err){
				console.log(err);
			} else {
				res.json(item);
			}
		});
	})
	.put(function(req, res){
		var id = req.params.id;
		var match = req.body;
		Match.update({'_id': id}, match, {safe: true}, function(err, result){
			if (err){
				res.send(err);
			} else {
				res.json(match);
			}
		});
	})
	.delete(function(req, res){
		var id = req.params.id;

		Match.findById(id, function (err, item){
			if (item){
				item.remove(function(err){
					if(err){
						res.send(err);
					} else {
						res.json({message: 'Match deleted'});
					}
				});
			} else {

			}

		});

	});

//RETURN
module.exports = router;
