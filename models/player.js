//DEPENDENCIES
var mongoose = require('mongoose');

//MODEL
var PlayerModel = mongoose.model('Player', { 
	id: Number,
	name: String, 
	points: Number
});

//Exports
module.exports = PlayerModel;