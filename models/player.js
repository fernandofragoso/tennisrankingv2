//DEPENDENCIES
var mongoose = require('mongoose');

//SCHEMA
var schema = new mongoose.Schema({ 
	name: String, 
	phone: String,
	points: Number,
	matches: [],
	tournaments: []
});

//EXPORTS
module.exports = mongoose.model('Player', schema);